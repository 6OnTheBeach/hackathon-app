import { defineConfig } from 'drizzle-kit';

// Configuration de drizzle-kit (npm run db:generate -w api). La génération
// compare schema.ts aux migrations existantes : pas besoin de la base.
export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
});
