# AGENTS.md

Plateforme B2B pour les clients professionnels de Givaudan : fiches produits
enrichies, comparateur et assistant IA explicatif. Mise en place : `README.md`.

## Lancer

Toutes les commandes se lancent dans le dev container (`.devcontainer/`).

- `npm ci` : installer les dépendances.
- `pg_isready -h db -U app -d app` doit répondre `accepting connections` :
  la base est le service `db` de `compose.yaml`.
- Avant de dire « fini » : `npm run lint` et `npm run format:check`. Ce sont
  les contrôles de la CI `qualite` (`.github/workflows/ci.yml`).

## Règles

- Les scripts SQL de `db/init/` ne sont joués qu'au premier démarrage de la
  base : les modifier ne change pas une base existante.
- Une branche `feature/…` par ticket, créée depuis le ticket, à partir de
  `develop`. La pull request vise `develop`.

## Décisions

- Lis `docs/adr/` avant d'ajouter une dépendance ou de changer de composant.
- Ne contredis pas un ADR au statut « acceptée ».
- S'il faut en changer, propose un nouvel ADR à partir de
  `docs/templates/adr.md`, au statut « proposée », puis arrête-toi.

## À ne pas faire

- Passer `--no-verify` à `git commit`, ou ajouter `eslint-disable`, pour
  faire passer un contrôle.
- Lancer `npm install` hors du dev container : `package-lock.json` doit
  rester valable sous Linux.
- Écrire une clé ou un mot de passe dans le code : les secrets vont dans
  `.env`, ignoré par git.
