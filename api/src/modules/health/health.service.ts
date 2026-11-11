import { sql } from 'drizzle-orm';
import { db } from '../../db/client.ts';

export type HealthResult =
  { ok: true; db: string } | { ok: false; error: string };

// Une base injoignable est un résultat attendu de ce contrôle, pas une
// erreur imprévue : on le renvoie, et la route choisit le code de statut.
export async function checkHealth(): Promise<HealthResult> {
  try {
    const result = await db.execute<{ version: string }>(sql`SELECT version()`);
    const version = result.rows[0]?.version;
    if (!version)
      return { ok: false, error: 'Réponse inattendue de la base de données' };
    return { ok: true, db: version };
  } catch (err) {
    // Le détail (hôte, port…) reste dans les logs, pas dans la réponse
    console.error('[health] base de données injoignable :', err);
    return { ok: false, error: 'Base de données injoignable' };
  }
}
