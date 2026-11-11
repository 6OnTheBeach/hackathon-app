# 0004. Écrire l'API avec Express

- Statut : acceptée
- Date : 2026-11-11
- Décideurs : Amaury (CTO / tech-lead)

## Contexte

L'API est une application Node 24 en TypeScript, séparée du front (voir
[0001](0001-TypeScript.md)). Elle sert au front le parcours Scent Journey
(conversation, profil olfactif, brief) et s'appuie sur PostgreSQL 17
(voir [0002](0002-base-de-donnees.md)). Son contrat est écrit à la main dans
`openapi.yaml`, avant le code (voir [0003](0003-contrat-api.md)) : le
framework n'a pas à générer ce contrat.
Le hackathon dure deux semaines. Express est utilisé dans les supports du
cours ; Fastify ne m'est pas connu ; NestJS m'intéresse pour sa structure,
mais je ne l'ai pas encore pratiqué.
Aucune exigence de performance particulière : l'application est un
prototype de démonstration.

## Options

1. Express (v5) : le framework HTTP minimal le plus répandu pour Node ;
   routeurs et middlewares, rien d'autre. Depuis la v5, une promesse rejetée
   dans une route est transmise au middleware d'erreurs sans code en plus.
   Il n'impose ni structure ni validation des entrées : l'organisation du code
   (modules, couches) est une convention de l'équipe, à faire respecter en
   relecture, et la validation est à ajouter si besoin. Les types viennent
   d'un paquet séparé (`@types/express`).
2. Fastify : framework HTTP orienté performances, écrit avec ses types
   TypeScript ; validation des requêtes et des réponses par JSON Schema
   intégrée, extensions par plugins. Sa génération de documentation OpenAPI
   (plugin `@fastify/swagger`) apporte peu ici, le contrat étant écrit à la
   main (0003). Son modèle de plugins (encapsulation, ordre de
   chargement) est à apprendre.
3. NestJS : framework structuré (modules, contrôleurs, services, injection
   de dépendances), qui impose une architecture. Il repose sur les
   décorateurs TypeScript et leurs métadonnées (`emitDecoratorMetadata`) :
   le code doit être compilé avant d'être exécuté, alors que Node 24 exécute
   directement le TypeScript sans décorateurs. Sa génération OpenAPI
   (`@nestjs/swagger`) apporte peu ici (0003). Plus de concepts et plus de
   code par route que les deux autres options.

## Décision

Nous choisissons l'option 1, Express, parce que sur deux semaines, le coût
d'apprentissage de NestJS (décorateurs, injection de dépendances, trois à
quatre fichiers par route, compilation obligatoire) dépasserait le gain de
sa structure. Cette structure, nous l'obtenons par une convention : une
organisation par modules et en couches, décrite dans `AGENTS.md`. Fastify
n'apporte pas d'avantage décisif ici : sa validation par schéma serait
utile, mais le contrat est déjà écrit à la main (0003).

## Conséquences

- Positives : peu de concepts à apprendre ; l'API tourne directement sous
  Node 24 en développement (`node --watch src/server.ts`), sans étape de
  compilation ; une structure proche de celle de NestJS, sans son coût
  d'apprentissage.
- Négatives, à accepter : pas de validation des entrées intégrée, à ajouter
  route par route ou avec une bibliothèque à choisir ; la structure par
  modules ne tient que par la convention d'`AGENTS.md` et la relecture des
  pull requests.
- À revoir si : le projet continue au-delà du hackathon et s'agrandit
  (NestJS redeviendrait pertinent), ou si la validation des entrées route
  par route devient trop coûteuse.
