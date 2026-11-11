# Image de l'API : service api de compose.yaml.
# Contexte de build : la racine du dépôt (workspaces npm, un seul package-lock).
# Même base que le dev container et la CI : Node 24 sur Debian trixie.

# --- Étape 1 : compiler le TypeScript
FROM node:24-trixie AS build
WORKDIR /app
# Les package.json d'abord : la couche npm ci reste en cache tant qu'ils ne
# changent pas. Celui de web est requis pour que le lock reste cohérent.
COPY package.json package-lock.json ./
COPY api/package.json api/
COPY web/package.json web/
# --ignore-scripts : le prepare racine (husky) n'a pas de dépôt git ici
RUN npm ci -w api --ignore-scripts
COPY api api
RUN npm run build -w api

# --- Étape 2 : l'image qui tourne, sans outils de dev ni sources TypeScript
FROM node:24-trixie
ENV NODE_ENV=production
WORKDIR /app
COPY package.json package-lock.json ./
COPY api/package.json api/
COPY web/package.json web/
RUN npm ci -w api --omit=dev --ignore-scripts && npm cache clean --force
# dist/ contient aussi les migrations (copiées par npm run build)
COPY --from=build /app/api/dist api/dist
USER node
EXPOSE 3000
# Applique les migrations, puis écoute sur le port 3000
CMD ["node", "api/dist/server.js"]
