import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { config } from '../config.ts';
import * as schema from './schema.ts';

export const pool = new pg.Pool({
  connectionString: config.databaseUrl,
  // Une base injoignable doit répondre vite, pas bloquer la requête
  connectionTimeoutMillis: 5000,
});

// Sans ce gestionnaire, une connexion inactive coupée par PostgreSQL
// ferait planter le processus
pool.on('error', (err) => {
  console.error('[db] connexion inactive perdue :', err.message);
});

export const db = drizzle(pool, { schema });
