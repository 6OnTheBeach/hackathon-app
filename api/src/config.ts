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

export const config = {
  port: port('PORT', 3000),
  databaseUrl: required('DATABASE_URL'),
};
