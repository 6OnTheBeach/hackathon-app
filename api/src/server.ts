import { createApp } from './app.ts';
import { config } from './config.ts';
import { pool } from './db/client.ts';
import { runMigrations } from './db/migrate.ts';

// Les migrations d'abord : l'API ne sert aucune requête sur un schéma périmé
await runMigrations();
console.log('[db] migrations appliquées');

const server = createApp().listen(config.port, () => {
  console.log(`[api] à l'écoute sur http://localhost:${config.port}/api`);
});

// docker compose stop envoie SIGTERM, Ctrl+C envoie SIGINT
function shutdown(signal: string) {
  console.log(`[api] ${signal} reçu, arrêt…`);
  server.close(() => {
    void pool.end().then(() => process.exit(0));
  });
}
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
