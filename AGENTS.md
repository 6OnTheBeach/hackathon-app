# AGENTS.md

Plateforme B2B pour les clients professionnels de Givaudan : fiches produits
enrichies, comparateur et assistant IA explicatif. Mise en place : `README.md`.

## Lancer

Toutes les commandes se lancent dans le dev container (`.devcontainer/`).

- `npm ci` : installer les dépendances (workspaces `api/` et `web/`).
- `test -f api/.env || cp api/.env.example api/.env` : la configuration de
  l'API (fait par le `postCreateCommand` du dev container).
- `pg_isready -h db -U app -d app` doit répondre `accepting connections` :
  la base est le service `db` de `compose.yaml`.
- `npm run dev` : l'API sur http://localhost:3000/api et le front sur
  http://localhost:5173 (qui relaie `/api` vers l'API).
- `curl localhost:3000/api/health` doit répondre `{"status":"ok",…}`.
- `npm run db:generate -w api` : génère une migration depuis
  `api/src/db/schema.ts`.
- Avant de dire « fini » : `npm run lint`, `npm run format:check` et
  `npm run build`. Ce sont les contrôles de la CI `qualite`
  (`.github/workflows/ci.yml`).
- `docker compose up` (hors du dev container, depuis l'hôte) : toute la stack,
  front sur http://localhost:8080 et API sur http://localhost:3001/api.

## Règles

- Les scripts SQL de `db/init/` ne sont joués qu'au premier démarrage de la
  base : les modifier ne change pas une base existante.
- Une branche `feature/…` par ticket, créée depuis le ticket, à partir de
  `develop`. La pull request vise `develop`.
- Le contrat de l'API est `openapi.yaml` : décris une route dans ce fichier avant de la coder, n'invente pas de route qui n'y figure pas.
- API : `src/app.ts` crée l'application, `src/server.ts` la démarre,
  `src/config.ts` est le seul à lire `process.env`.
- Un dossier par domaine, `api/src/modules/<domaine>/` :
  `<domaine>.routes.ts` ne fait que du HTTP (paramètres, codes de statut) ;
  `<domaine>.service.ts` porte la logique et l'accès à la base. Une route
  n'accède jamais directement à la base.
- Les erreurs imprévues remontent au middleware central
  (`src/middlewares/error-handler.ts`), au format `Error` d'`openapi.yaml`.
- Le schéma de la base est dans `api/src/db/schema.ts` (Drizzle) ; on le
  change par une migration générée (`npm run db:generate -w api`), relue et
  commitée, appliquée au démarrage de l'API. `db/init/` ne fait qu'activer
  pgvector. Si `develop` a reçu une migration entre-temps, régénère la tienne
  par-dessus : le migrateur ignore une migration plus ancienne que la
  dernière appliquée (ADR 0005).

## Décisions

- Lis `docs/adr/` avant d'ajouter une dépendance ou de changer de composant.
- Ne contredis pas un ADR au statut « acceptée ».
- S'il faut en changer, propose un nouvel ADR à partir de
  `docs/templates/0000-modele.md`, au statut « proposée », puis arrête-toi.

## À ne pas faire

- Passer `--no-verify` à `git commit`, ou ajouter `eslint-disable`, pour
  faire passer un contrôle.
- Lancer `npm install` hors du dev container : `package-lock.json` doit
  rester valable sous Linux.
- Écrire une clé ou un mot de passe dans le code : les secrets vont dans
  `.env`, ignoré par git.
