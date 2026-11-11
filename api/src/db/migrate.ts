import path from 'node:path';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db } from './client.ts';

// Les migrations sont à côté de ce fichier : src/db/migrations en dev,
// dist/db/migrations une fois compilé (copiées par npm run build)
const migrationsFolder = path.join(import.meta.dirname, 'migrations');

// Applique les migrations pas encore jouées (suivies dans la table
// drizzle.__drizzle_migrations)
export async function runMigrations(): Promise<void> {
  await migrate(db, { migrationsFolder });
}
