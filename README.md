# hackathon-app

Projet de l'équipe pour le **Givaudan AI Innovation Challenge 2026**.

**Scent Journey** : le client raconte un souvenir (« une forêt tropicale juste après l'averse… ») ; l'IA en tire une compréhension (lieu, moment, météo, émotion), une signature olfactive, une roue des familles et un profil (notes de tête, de cœur et de fond).

Tout tourne dans un **dev container** : chacun a le même Node, la même base de données et les mêmes outils, quel que soit son ordinateur. Pourquoi ce choix : [Pourquoi tout conteneuriser](https://learn.glassworks.tech/fullstack-setup/environnement/principes).

## Stack

- API et front en TypeScript sur Node 24 : [ADR 0001](docs/adr/0001-TypeScript.md)
- PostgreSQL 17 avec pgvector : [ADR 0002](docs/adr/0002-base-de-donnees.md)
- Contrat de l'API dans [`openapi.yaml`](openapi.yaml) : [ADR 0003](docs/adr/0003-contrat-api.md)
- API avec Express 5 : [ADR 0004](docs/adr/0004-framework-api.md)
- Accès à la base avec Drizzle ORM, migrations appliquées au démarrage de l'API : [ADR 0005](docs/adr/0005-acces-aux-donnees.md)
- Front React + Vite
- IA : le service FastAPI de l'équipe Data/IA ([rag-g24](https://github.com/danelquentin04/rag-g24)), ou une réponse fictive : voir [L'IA](#lia--mock-ou-service-dataia)

## Qui a besoin de quoi ?

- **Pour lancer le projet sur ta machine** (développer, tester, faire une démo) : suis les [Prérequis](#prérequis-une-seule-fois), puis [Démarrer](#démarrer).
- **Tout est déjà installé ?** Va directement à [Démarrer](#démarrer).
- **Tu veux juste suivre l'avancement** (issues, pull requests) : un compte GitHub membre de l'organisation suffit, rien à installer.

Tout ce README suit le cours [Dev prêt pour la prod](https://learn.glassworks.tech/fullstack-setup/) : en cas de doute, chaque étape renvoie à la page correspondante.

---

## Prérequis (une seule fois)

Détails dans le cours : [Le dev container › Prérequis](https://learn.glassworks.tech/fullstack-setup/environnement/devcontainer#prérequis).

### Windows

1. **WSL 2 + Ubuntu** : dans PowerShell (administrateur) :

   ```powershell
   wsl --install
   ```

   Redémarrer, ouvrir **Ubuntu** depuis le menu Démarrer et créer son utilisateur. Le projet vivra **dans Ubuntu**, jamais dans `C:\` (bien plus rapide, et PostgreSQL y fonctionne).

2. **Docker Desktop** : [télécharger](https://www.docker.com/products/docker-desktop/), puis dans ses réglages :
   - **General** → **Use the WSL 2 based engine**
   - **Resources → WSL integration** → activer **Ubuntu**

3. **VS Code** : [télécharger](https://code.visualstudio.com), puis installer les extensions **WSL** et **Dev Containers** (onglet Extensions, `Ctrl+Shift+X`).

4. **git et clé SSH**, dans le terminal **Ubuntu** :

   ```bash
   git config --global user.name "Prénom Nom"
   git config --global user.email "email@github.com"
   ssh-keygen -t ed25519 -C "email@github.com"   # Entrée pour tout accepter
   cat ~/.ssh/id_ed25519.pub                       # la clé publique, à copier
   ```

   Sur GitHub : photo de profil → **Settings → SSH and GPG keys → New SSH key**, coller la clé.

5. **Agent SSH automatique** (nécessaire sous Windows) : VS Code relaie ta clé au conteneur **seulement si un agent SSH tourne** dans Ubuntu, et Ubuntu ne le lance pas tout seul. Sans lui, `git push` échoue dans le conteneur avec `Permission denied (publickey)`. Ce bloc, à ajouter à la fin de `~/.bashrc` (`nano ~/.bashrc`, puis `Ctrl+O`, `Entrée`, `Ctrl+X`), lance l'agent s'il n'existe pas encore, s'y connecte et y charge ta clé à chaque ouverture d'Ubuntu :

   ```bash
   # Agent SSH pour le dev container
   if [ -z "$SSH_AUTH_SOCK" ]; then
      RUNNING_AGENT="`ps -ax | grep 'ssh-agent -s' | grep -v grep | wc -l | tr -d '[:space:]'`"
      if [ "$RUNNING_AGENT" = "0" ]; then
           ssh-agent -s &> $HOME/.ssh/ssh-agent
      fi
      eval `cat $HOME/.ssh/ssh-agent` > /dev/null
      ssh-add $HOME/.ssh/id_ed25519 2> /dev/null
   fi
   ```

   Source : [Sharing Git credentials with your container](https://code.visualstudio.com/remote/advancedcontainers/sharing-git-credentials) (doc VS Code, citée par le cours).
   Dans PowerShell : `wsl --shutdown`, puis rouvrir Ubuntu et vérifier :

   ```bash
   ssh-add -l                # doit afficher la clé (ED25519)
   ssh -T git@github.com     # doit répondre « Hi <pseudo>! … »
   ```

   Plan B sans SSH : `gh auth login` dans le terminal du conteneur, et cloner avec l'adresse HTTPS du dépôt.

### macOS

1. [Docker Desktop](https://www.docker.com/products/docker-desktop/) et [VS Code](https://code.visualstudio.com) + l'extension **Dev Containers**.
2. git et clé SSH comme sous Windows (étape 4), dans le Terminal. L'agent SSH tourne déjà, il suffit d'y charger la clé : `ssh-add --apple-use-keychain ~/.ssh/id_ed25519`.

### Linux

1. Docker Engine, [VS Code](https://code.visualstudio.com) + l'extension **Dev Containers**.
2. git et clé SSH comme sous Windows (étape 4). Si `ssh-add -l` répond « Could not open a connection to your authentication agent », ajouter aussi le bloc de l'étape 5.

---

## Démarrer

1. **Cloner** (sous Windows : dans le terminal **Ubuntu**)
   ```bash
   git clone git@github.com:6OnTheBeach/hackathon-app.git
   cd hackathon-app
   code .
   ```
   Aucun conteneur à lancer à la main : VS Code s'en charge à l'étape suivante.
2. **Ouvrir dans le conteneur** : `F1` → **Dev Containers: Reopen in Container**.
   La première fois, compter quelques minutes : l'image se construit, la base démarre et les dépendances s'installent (`npm ci`).
   Le conteneur crée aussi `api/.env` à partir de `api/.env.example` (identifiants de la base de dev).
3. **Vérifier**, dans le terminal de VS Code :
   ```bash
   pg_isready -h db -U app -d app   # doit répondre « accepting connections »
   ```
4. **Lancer l'API et le front** :
   ```bash
   npm run dev
   ```
   Ouvrir http://localhost:5173 : l'écran **Racontez un souvenir** s'affiche. Écrire un souvenir, **Envoyer** : « L'IA analyse votre souvenir… », puis la signature, la compréhension, la roue et le profil. Par défaut, l'IA est fictive (`AI_PROVIDER=mock`) : la réponse est toujours la même. L'API seule répond sur http://localhost:3000/api/health.

Ce que fait le conteneur : [Le dev container › Comment ça marche](https://learn.glassworks.tech/fullstack-setup/environnement/devcontainer#comment-ça-marche).

### Sans dev container : `docker compose up`

Pour une démo, ou pour Product et Data/IA : toute la stack (base, API, front) démarre avec une seule commande, depuis un clone neuf, sans VS Code. Sous Windows : dans le terminal **Ubuntu**, dans le dossier du projet.

```bash
docker compose up --build       # --build : reconstruit les images après un git pull
```

- Front : http://localhost:8080 (l'écran **Racontez un souvenir**)
- API : http://localhost:3001/api/health

Les ports diffèrent de ceux de `npm run dev` (5173 et 3000) : les deux peuvent tourner en même temps sans conflit. Le front y est servi par `vite preview`, suffisant pour une démo mais pas un serveur de production. `Ctrl+C` arrête tout ; `docker compose down` supprime les conteneurs (les données de la base restent dans `db/data`).

### L'IA : mock ou service Data/IA

L'API choisit son fournisseur d'IA avec `AI_PROVIDER` :

| `AI_PROVIDER`   | Ce que fait l'API                                                                                                     |
| --------------- | --------------------------------------------------------------------------------------------------------------------- |
| `mock` (défaut) | renvoie une réponse fixe (forêt tropicale après la pluie) : pour développer sans le service Data/IA                   |
| `data`          | appelle `POST {DATA_AI_URL}/ask` (service FastAPI de Data/IA), délai maximum de 120 s ; la réponse prend 20 s et plus |

**Lancer le service Data/IA**, sur la machine hôte (sous Windows : dans Ubuntu), depuis son dépôt [rag-g24](https://github.com/danelquentin04/rag-g24) :

```bash
uvicorn api:app --host 0.0.0.0 --port 8000
```

`--host 0.0.0.0` est indispensable : sans lui, uvicorn n'écoute que sur `127.0.0.1` et les conteneurs ne peuvent pas l'atteindre. Les conteneurs le joignent par `http://host.docker.internal:8000` (`extra_hosts` dans `compose.yaml`).

- **Avec `npm run dev`** (dev container) : dans `api/.env`, `AI_PROVIDER=data`, puis relancer `npm run dev`. Un `api/.env` créé avant cette version n'a pas ces lignes : les recopier depuis `api/.env.example`.
- **Avec docker compose** : `AI_PROVIDER=data docker compose up --build`.

**Service Data/IA derrière un tunnel ngrok** : `DATA_AI_URL` prend l'adresse du tunnel, et `DATA_AI_KEY` la clé d'API exigée par le service (envoyée dans l'en-tête `X-API-Key`). Avec `npm run dev`, dans `api/.env` ; avec docker compose : `AI_PROVIDER=data DATA_AI_URL=https://….ngrok-free.app DATA_AI_KEY=… docker compose up --build`. Sans clé, ou avec une clé refusée, le service répond 401 et l'API renvoie un 502 qui le dit.

Si l'IA est injoignable, trop lente, ou renvoie une réponse invalide, l'API répond 502 avec un message clair (affiché par le front), et le souvenir reste enregistré, sans analyse.

---

## Au quotidien

| Commande (terminal du conteneur) | Rôle                                                                |
| -------------------------------- | ------------------------------------------------------------------- |
| `npm run dev`                    | API (port 3000) et front (port 5173), rechargés à chaque sauvegarde |
| `npm run build`                  | compile l'API et le front (comme la CI `qualite`)                   |
| `npm run lint`                   | ESLint sur tout le projet                                           |
| `npm run format`                 | Prettier corrige la forme                                           |
| `npm run format:check`           | vérifie la forme (comme la CI `qualite`)                            |
| `npm run db:generate -w api`     | génère une migration depuis `api/src/db/schema.ts`                  |
| `curl localhost:3000/api/health` | vérifie que l'API et la base répondent                              |
| `pg_isready -h db -U app -d app` | vérifie que la base répond                                          |
| `psql -h db -U app -d app`       | session SQL sur la base                                             |

**Changer le schéma de la base** : modifier `api/src/db/schema.ts`, lancer `npm run db:generate -w api`, relire et commiter le SQL généré dans `api/src/db/migrations/`. L'API applique les migrations à son démarrage. Si `develop` a reçu une migration entre-temps, régénérer la sienne après l'avoir récupéré ([ADR 0005](docs/adr/0005-acces-aux-donnees.md)).

**On ne pousse jamais sur `develop` ni `main`** (c'est bloqué). Chaque tâche part d'un **ticket** (Issues → New issue, avec un modèle) :

1. Dans le ticket : **Development → Create a branch**, à partir de `develop`.
   Nommer la branche `feature/<numéro>-<sujet>`.
2. Dans le terminal du conteneur :
   ```bash
   git fetch origin
   git switch feature/12-mon-sujet
   # … coder, git add, git commit …
   git push
   ```
3. Sur GitHub : **Compare & pull request** vers `develop`, check `qualite` vert,
   **Squash and merge**. Le ticket, lié à la branche, passe en Done tout seul.

Le pourquoi : [GitFlow et branches protégées](https://learn.glassworks.tech/fullstack-setup/collaboration/gitflow).

⚠️ Toujours **commiter depuis le terminal du dev container** : le hook pre-commit a besoin de son Node ([Qualité avant le commit](https://learn.glassworks.tech/fullstack-setup/collaboration/qualite)).

**Remettre la base à zéro** : les scripts SQL de `db/init/` ne sont joués qu'au premier démarrage de la base. Après en avoir modifié ou récupéré un, il faut donc repartir d'une base vide : `F1` → **Dev Containers: Reopen Folder Locally**, puis dans Ubuntu `sudo rm -rf db/data`, puis `F1` → **Dev Containers: Reopen in Container** ([La base de données](https://learn.glassworks.tech/fullstack-setup/environnement/base-de-donnees#le-schéma-et-les-données-de-test)).

---

## Règles du projet

- **API** : le contrat est [`openapi.yaml`](openapi.yaml). Une route y est décrite **avant** d'être codée. Routes actuelles : `GET /health`, `POST /journeys`, `POST /journeys/{id}/messages`.
- **Décisions** : lire [`docs/adr/`](docs/adr/) avant d'ajouter une dépendance ou de changer de composant. Pour revenir sur une décision, proposer un nouvel ADR à partir de [`docs/templates/0000-modele.md`](docs/templates/0000-modele.md), au statut « proposée ».
- **Secrets** : clés et mots de passe vont dans `.env` (ignoré par git), jamais dans le code.
- **Avant une pull request** : `npm run lint`, `npm run format:check` et `npm run build` doivent passer.

Les mêmes règles, pour les agents IA : [`AGENTS.md`](AGENTS.md).

---

## Dépannage

| Problème                                                          | Solution                                                                                                                                                                                |
| ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Permission denied (publickey)` au `git push`                     | Fermer VS Code ; dans Ubuntu, `ssh-add -l` doit afficher la clé (sinon : Prérequis, étape 5) ; rouvrir avec `code .` depuis Ubuntu, puis `F1` → **Dev Containers: Reopen in Container** |
| `Network is unreachable`, l'installation échoue                   | Éviter le partage de connexion d'un téléphone (souvent IPv6 uniquement : WSL et Docker n'y ont pas Internet) ; passer sur un Wi-Fi ou une box                                           |
| **Reopen in Container** propose une liste de modèles              | Mauvais dossier ouvert : `Échap`, puis ouvrir le dossier `hackathon-app` qui contient `.devcontainer/`                                                                                  |
| VS Code demande d'autoriser `wsl.localhost`                       | Projet ouvert depuis Windows : **Cancel**, puis `code .` depuis Ubuntu                                                                                                                  |
| `GH013 … Changes must be made through a pull request`             | Normal : passer par une branche `feature/…` et une pull request                                                                                                                         |
| `Cannot connect to the Docker daemon` ou `protocol not available` | Docker Desktop n'a pas fini de démarrer : attendre « Engine running ». Sinon, quitter Docker Desktop, `wsl --shutdown` dans PowerShell, relancer Docker Desktop                         |
| Le front affiche « Le service d'IA est injoignable »              | Service Data/IA non lancé, ou lancé sans `--host 0.0.0.0` : voir [L'IA](#lia--mock-ou-service-dataia). Pour travailler sans lui : `AI_PROVIDER=mock`                                    |
| `Updating VS Code Server…` à l'ouverture                          | Normal après une mise à jour de VS Code : attendre la fin du téléchargement                                                                                                             |

Le conteneur ne démarre pas ? `F1` → **Dev Containers: Show Container Log**, puis le tableau d'erreurs du cours : [Le dev container › Lancer](https://learn.glassworks.tech/fullstack-setup/environnement/devcontainer#lancer).
