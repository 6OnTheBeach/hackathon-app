// Lit et vérifie les variables d'environnement, une seule fois, au démarrage.
// En local, elles viennent de api/.env (copié depuis api/.env.example) ;
// dans docker compose, du bloc environment du service api.

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Variable d'environnement ${name} manquante : copie api/.env.example vers api/.env`,
    );
  }
  return value;
}

function port(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw === '') return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < 1 || value > 65535) {
    throw new Error(`Variable d'environnement ${name} invalide : « ${raw} »`);
  }
  return value;
}

// Le fournisseur de l'IA : mock (réponse fixe, par défaut) ou data (le
// service FastAPI de l'équipe Data/IA, à l'adresse DATA_AI_URL)
const AI_PROVIDERS = ['mock', 'data'] as const;
export type AiProvider = (typeof AI_PROVIDERS)[number];

function aiProvider(name: string): AiProvider {
  const raw = process.env[name];
  if (raw === undefined || raw === '') return 'mock';
  const value = AI_PROVIDERS.find((p) => p === raw);
  if (!value) {
    throw new Error(
      `Variable d'environnement ${name} invalide : « ${raw} » (attendu : ${AI_PROVIDERS.join(' ou ')})`,
    );
  }
  return value;
}

function url(name: string): string {
  const raw = required(name);
  try {
    // Sans la barre finale : on y ajoute /ask
    return new URL(raw).toString().replace(/\/+$/, '');
  } catch {
    throw new Error(`Variable d'environnement ${name} invalide : « ${raw} »`);
  }
}

const provider = aiProvider('AI_PROVIDER');

export const config = {
  port: port('PORT', 3000),
  databaseUrl: required('DATABASE_URL'),
  ai: {
    provider,
    // Lue et vérifiée seulement si le fournisseur est data
    dataUrl: provider === 'data' ? url('DATA_AI_URL') : undefined,
    // Le modèle de Data/IA met 20 s et plus : au-delà, on abandonne
    timeoutMs: 120_000,
  },
};
