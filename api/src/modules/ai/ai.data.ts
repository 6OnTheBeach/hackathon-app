import { AiError } from './ai.types.ts';

// Fournisseur data (AI_PROVIDER=data) : le service FastAPI de l'équipe
// Data/IA (dépôt rag-g24, api.py). POST {DATA_AI_URL}/ask, corps
// { question }, réponse { question, answer, model, sources }. Si une clé est
// fournie (DATA_AI_KEY), elle part dans l'en-tête X-API-Key (tunnel ngrok).
// Renvoie l'answer brut : sa validation est faite par ai.service.ts.

type AskResponse = { answer: unknown; model: unknown };

export async function askDataAi(
  baseUrl: string,
  text: string,
  timeoutMs: number,
  apiKey?: string,
): Promise<{ answer: unknown; model: string }> {
  let res: Response;
  try {
    res = await fetch(`${baseUrl}/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { 'X-API-Key': apiKey } : {}),
      },
      body: JSON.stringify({ question: text }),
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === 'TimeoutError') {
      throw new AiError(
        `L'IA n'a pas répondu dans le délai imparti (${timeoutMs / 1000} s)`,
        { cause: err },
      );
    }
    throw new AiError("Le service d'IA est injoignable", { cause: err });
  }

  // Clé absente ou refusée : vérifié avant de lire le corps, qui n'est pas
  // forcément du JSON
  if (res.status === 401) {
    throw new AiError(
      apiKey
        ? "Le service d'IA a refusé la clé d'API (HTTP 401) : vérifiez DATA_AI_KEY"
        : "Le service d'IA exige une clé d'API (HTTP 401) : définissez DATA_AI_KEY",
      { cause: await res.text().catch(() => undefined) },
    );
  }

  // Le corps peut lui aussi être coupé par le délai : même traitement
  let body: unknown;
  try {
    body = await res.json();
  } catch (err) {
    if (err instanceof DOMException && err.name === 'TimeoutError') {
      throw new AiError(
        `L'IA n'a pas répondu dans le délai imparti (${timeoutMs / 1000} s)`,
        { cause: err },
      );
    }
    throw new AiError("Le service d'IA a renvoyé une réponse illisible", {
      cause: err,
    });
  }

  if (!res.ok) {
    // FastAPI : { detail } ; 503 si sa base est vide, 502 si Ollama échoue
    throw new AiError(
      `Le service d'IA a répondu par une erreur (HTTP ${res.status})`,
      {
        cause: body,
      },
    );
  }

  if (typeof body !== 'object' || body === null || !('answer' in body)) {
    throw new AiError("Le service d'IA a renvoyé une réponse sans « answer »", {
      cause: body,
    });
  }
  const { answer, model } = body as AskResponse;
  return { answer, model: typeof model === 'string' ? model : 'inconnu' };
}
