import { config } from '../../config.ts';
import { askDataAi } from './ai.data.ts';
import { analyzeMock } from './ai.mock.ts';
import { AiError, type AnalyzeResult } from './ai.types.ts';
import { parseAnalysis } from './ai.validate.ts';

// Analyse un souvenir avec le fournisseur choisi par AI_PROVIDER, et vérifie
// le format de la réponse. Lève une AiError (message lisible) si l'IA est
// injoignable, trop lente, ou si sa réponse est invalide.
export async function analyze(text: string): Promise<AnalyzeResult> {
  const raw =
    config.ai.provider === 'data' && config.ai.dataUrl
      ? await askDataAi(
          config.ai.dataUrl,
          text,
          config.ai.timeoutMs,
          config.ai.dataKey,
        )
      : await analyzeMock(text);

  // api.py renvoie le texte brut du modèle quand ce n'est pas du JSON
  if (typeof raw.answer === 'string') {
    throw new AiError(
      "L'IA n'a pas renvoyé d'analyse structurée (JSON invalide) : réessayez",
      { cause: raw.answer },
    );
  }
  const parsed = parseAnalysis(raw.answer);
  if (!parsed.ok) {
    throw new AiError("L'IA a renvoyé une analyse dans un format inattendu", {
      cause: parsed.problems,
    });
  }
  return { analysis: parsed.analysis, model: raw.model };
}
