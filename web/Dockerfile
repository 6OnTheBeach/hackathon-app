# Image du front : service web de compose.yaml.
# Contexte de build : la racine du dépôt (workspaces npm, un seul package-lock).
# Même base que le dev container et la CI : Node 24 sur Debian trixie.
FROM node:24-trixie
WORKDIR /app
# Les package.json d'abord : la couche npm ci reste en cache tant qu'ils ne
# changent pas. Celui d'api est requis pour que le lock reste cohérent.
COPY package.json package-lock.json ./
COPY api/package.json api/
COPY web/package.json web/
# --ignore-scripts : le prepare racine (husky) n'a pas de dépôt git ici
RUN npm ci -w web --ignore-scripts
COPY web web
RUN npm run build -w web
USER node
EXPOSE 4173
# vite preview sert web/dist et relaie /api vers API_URL (vite.config.ts).
# Pas un serveur de production : suffisant pour la démo (voir README).
CMD ["npm", "run", "preview", "-w", "web", "--", "--host", "0.0.0.0"]
