import { eq } from 'drizzle-orm';
import { db } from '../../db/client.ts';
import { journeys, messages } from '../../db/schema.ts';
import { analyze } from '../ai/ai.service.ts';
import { AiError, type Analysis } from '../ai/ai.types.ts';

// Schémas Journey et Message d'openapi.yaml
export type Journey = { id: string; createdAt: Date };

export type Message = {
  id: string;
  journeyId: string;
  text: string;
  createdAt: Date;
  model: string;
  analysis: Analysis;
};

// Un parcours inconnu ou une IA défaillante sont des résultats attendus :
// on les renvoie, et la route choisit le code de statut. Une erreur de la
// base, elle, est imprévue : elle remonte au middleware central.
export type AddMessageResult =
  | { ok: true; message: Message }
  | { ok: false; reason: 'journey_not_found' }
  | { ok: false; reason: 'ai_failed'; error: string };

export async function createJourney(): Promise<Journey> {
  const [journey] = await db.insert(journeys).values({}).returning();
  if (!journey) throw new Error("L'insertion du parcours n'a rien renvoyé");
  return journey;
}

// Enregistre le souvenir, l'envoie à l'IA, puis enregistre sa réponse. Si
// l'IA échoue, le souvenir reste en base, sans analyse (analysis = null).
export async function addMessage(
  journeyId: string,
  text: string,
): Promise<AddMessageResult> {
  const journey = await db.query.journeys.findFirst({
    where: eq(journeys.id, journeyId),
    columns: { id: true },
  });
  if (!journey) return { ok: false, reason: 'journey_not_found' };

  const [saved] = await db
    .insert(messages)
    .values({ journeyId, text })
    .returning({
      id: messages.id,
      journeyId: messages.journeyId,
      text: messages.text,
      createdAt: messages.createdAt,
    });
  if (!saved) throw new Error("L'insertion du message n'a rien renvoyé");

  let result;
  try {
    result = await analyze(text);
  } catch (err) {
    if (!(err instanceof AiError)) throw err;
    console.error(
      `[ai] échec pour le message ${saved.id} :`,
      err.message,
      err.cause,
    );
    return { ok: false, reason: 'ai_failed', error: err.message };
  }

  await db
    .update(messages)
    .set({
      analysis: result.analysis,
      model: result.model,
      answeredAt: new Date(),
    })
    .where(eq(messages.id, saved.id));

  return { ok: true, message: { ...saved, ...result } };
}
