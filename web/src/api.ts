// Appels à l'API et types, alignés sur openapi.yaml. Chemins relatifs : le
// serveur Vite relaie /api vers l'API (vite.config.ts).

export type Comprehension = {
  lieu: string;
  moment: string;
  meteo: string;
  emotion: string;
  elements: string[];
};

export type ProfilNote = {
  ingredient: string;
  reference: string;
  raison: string;
  sources: string[];
};

export type Analysis = {
  comprehension: Comprehension;
  signature: { nom: string; description: string };
  roue: { famille: string; pourcentage: number }[];
  profil?: { tete: ProfilNote[]; coeur: ProfilNote[]; fond: ProfilNote[] };
  limites_catalogue: string[];
  informations_manquantes: string[];
  brief: string;
};

export type Journey = { id: string; createdAt: string };

export type Message = {
  id: string;
  journeyId: string;
  text: string;
  createdAt: string;
  model: string;
  analysis: Analysis;
};

type ApiError = { status: 'error'; error: string };

function isApiError(body: unknown): body is ApiError {
  return (
    typeof body === 'object' &&
    body !== null &&
    'status' in body &&
    body.status === 'error' &&
    'error' in body &&
    typeof body.error === 'string'
  );
}

// Une erreur renvoyée par l'API, avec son code HTTP (0 : API injoignable)
export class ApiRequestError extends Error {
  readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function post<T>(path: string, body?: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiRequestError("L'API est injoignable", 0);
  }
  const data: unknown = await res.json().catch(() => null);
  if (res.ok && data !== null) return data as T;
  if (isApiError(data)) throw new ApiRequestError(data.error, res.status);
  throw new ApiRequestError(
    `Réponse inattendue de l'API (HTTP ${res.status})`,
    res.status,
  );
}

// POST /api/journeys
export function createJourney(): Promise<Journey> {
  return post<Journey>('/api/journeys');
}

// POST /api/journeys/{id}/messages : lent, l'IA met 20 s et plus
export function sendMessage(journeyId: string, text: string): Promise<Message> {
  return post<Message>(
    `/api/journeys/${encodeURIComponent(journeyId)}/messages`,
    { text },
  );
}
