// Le schéma de la base, en TypeScript.
//
// Pour ajouter ou modifier une table :
// 1. la décrire ici (drizzle-orm/pg-core) ;
// 2. npm run db:generate -w api : écrit la migration SQL dans ./migrations ;
// 3. relire et commiter la migration : l'API l'applique à son démarrage.
import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import type { Analysis } from '../modules/ai/ai.types.ts';

// Un parcours Scent Journey, anonyme : il regroupe les souvenirs d'un client
export const journeys = pgTable('journeys', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// Un souvenir raconté, et l'analyse que l'IA en a tirée. analysis reste null
// si l'IA a échoué : le souvenir est conservé quand même.
export const messages = pgTable(
  'messages',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    journeyId: uuid('journey_id')
      .notNull()
      .references(() => journeys.id, { onDelete: 'cascade' }),
    text: text('text').notNull(),
    // Le champ answer du service Data/IA, une fois validé (jsonb : son
    // contenu varie d'un souvenir à l'autre, ADR 0005)
    analysis: jsonb('analysis').$type<Analysis>(),
    model: text('model'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    answeredAt: timestamp('answered_at', { withTimezone: true }),
  },
  (table) => [index('messages_journey_id_idx').on(table.journeyId)],
);
