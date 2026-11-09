# hackathon-app

Projet de l'équipe pour le **Givaudan AI Innovation Challenge 2026**.

Tout tourne dans un **dev container** : chacun a le même Node, la même base de données et les mêmes outils, quel que soit son ordinateur. Pourquoi ce choix : [Pourquoi tout conteneuriser](https://learn.glassworks.tech/fullstack-setup/environnement/principes).

## Stack (à définir par l'équipe)

---

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

6. **Ollama** (l'IA en local) : [installer la version Windows](https://ollama.com/download) (choisir « use Ollama locally », pas besoin de compte), puis dans PowerShell :
   ```powershell
   ollama pull llama3.2:1b
   ```
   Détails : [L'IA › Ollama sur votre machine](https://learn.glassworks.tech/fullstack-setup/environnement/ia#ollama-sur-votre-machine).

### macOS

1. [Docker Desktop](https://www.docker.com/products/docker-desktop/) et [VS Code](https://code.visualstudio.com) + l'extension **Dev Containers**.
2. git et clé SSH comme sous Windows (étape 4), dans le Terminal. L'agent SSH tourne déjà, il suffit d'y charger la clé : `ssh-add --apple-use-keychain ~/.ssh/id_ed25519`.
3. [Ollama](https://ollama.com/download), puis `ollama pull llama3.2:1b`.

### Linux

1. Docker Engine, [VS Code](https://code.visualstudio.com) + l'extension **Dev Containers**.
2. git et clé SSH comme sous Windows (étape 4). Si `ssh-add -l` répond « Could not open a connection to your authentication agent », ajouter aussi le bloc de l'étape 5.
3. Ollama : `curl -fsSL https://ollama.com/install.sh | sh`, puis `ollama pull llama3.2:1b`. Il doit écouter sur toutes les interfaces pour être joignable depuis le conteneur : voir l'encadré « Sous Linux » de [L'IA](https://learn.glassworks.tech/fullstack-setup/environnement/ia#3-rendre-votre-machine-joignable).

---

## Démarrer

1. **Cloner** (sous Windows : dans le terminal **Ubuntu**)
   ```bash
   git clone git@github.com:Hetic-Hackathon-Givaudan-2026-Sanchez/hackathon-app.git
   cd hackathon-app
   code .
   ```
   Aucun conteneur à lancer à la main : VS Code s'en charge à l'étape suivante.
2. **Ouvrir dans le conteneur** : `F1` → **Dev Containers: Reopen in Container**. La première fois, compter quelques minutes : l'image se construit, la base démarre avec ses données de test, les dépendances et `api/.env` s'installent seuls.
3. **Lancer**, dans le terminal de VS Code :
   ```bash
   npm run dev
   ```
   puis ouvrir http://localhost:5173 : « API OK · PostgreSQL 17… » et la liste des questions.

Ce que fait le conteneur : [Le dev container › Comment ça marche](https://learn.glassworks.tech/fullstack-setup/environnement/devcontainer#comment-ça-marche).

---

## Au quotidien

| Commande (terminal du conteneur)      | Rôle                                            |
| ------------------------------------- | ----------------------------------------------- |
| `npm run dev`                         | lance l'API (port 3000) et le front (port 5173) |
| `npm run lint`                        | ESLint sur tout le projet                       |
| `npm run format`                      | Prettier corrige la forme                       |
| `npm run build`                       | vérifie que tout compile (comme la CI)          |
| `psql postgres://app:app@db:5432/app` | session SQL sur la base                         |

**On ne pousse jamais sur `develop` ni `main`** (c'est bloqué). Pour chaque tâche :

```bash
git checkout develop && git pull
git checkout -b feature/ma-tache
# … coder, git add, git commit …
git push -u origin feature/ma-tache
```

Puis une pull request vers `develop`, check `qualite` vert, relecture, **Squash and merge**. Le pourquoi : [GitFlow et branches protégées](https://learn.glassworks.tech/fullstack-setup/collaboration/gitflow).

⚠️ Toujours **commiter depuis le terminal du dev container** : le hook pre-commit a besoin de son Node ([Qualité avant le commit](https://learn.glassworks.tech/fullstack-setup/collaboration/qualite)).

**Remettre la base à zéro** : `F1` → **Dev Containers: Reopen Folder Locally**, puis dans Ubuntu `sudo rm -rf db/data`, puis `F1` → **Dev Containers: Reopen in Container** ([La base de données](https://learn.glassworks.tech/fullstack-setup/environnement/base-de-donnees#le-schéma-et-les-données-de-test)).

---

## Dépannage

| Problème                                              | Solution                                                                                                                                                                                |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Permission denied (publickey)` au `git push`         | Fermer VS Code ; dans Ubuntu, `ssh-add -l` doit afficher la clé (sinon : Prérequis, étape 5) ; rouvrir avec `code .` depuis Ubuntu, puis `F1` → **Dev Containers: Reopen in Container** |
| `Network is unreachable`, l'installation échoue       | Éviter le partage de connexion d'un téléphone (souvent IPv6 uniquement : WSL et Docker n'y ont pas Internet) ; passer sur un Wi-Fi ou une box                                           |
| **Reopen in Container** propose une liste de modèles  | Mauvais dossier ouvert : `Échap`, puis ouvrir le dossier `hackathon-app` qui contient `.devcontainer/`                                                                                  |
| VS Code demande d'autoriser `wsl.localhost`           | Projet ouvert depuis Windows : **Cancel**, puis `code .` depuis Ubuntu                                                                                                                  |
| La question à l'IA échoue                             | Ollama doit tourner (icône du lama) et le modèle être téléchargé (`ollama list`)                                                                                                        |
| `GH013 … Changes must be made through a pull request` | Normal : passer par une branche `feature/…` et une pull request                                                                                                                         |

Le conteneur ne démarre pas ? `F1` → **Dev Containers: Show Container Log**, puis le tableau d'erreurs du cours : [Le dev container › Lancer](https://learn.glassworks.tech/fullstack-setup/environnement/devcontainer#lancer).
