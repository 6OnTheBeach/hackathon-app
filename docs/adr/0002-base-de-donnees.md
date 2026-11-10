# 0002 - définir la base de données

- Statut : acceptée
- Date : 2026-11-10
- Décideurs : Amaury (CTO / tech-lead) / Quentin/Emma data/IA

## Contexte

La plateforme B2B doit stocker un catalogue de produits Givaudan et servir
trois usages : des fiches produits enrichies, un comparateur et un assistant
IA explicatif. Les produits sont liés entre eux (catégories, applications),
et leurs caractéristiques techniques varient d'un type de produit à l'autre.
Le comparateur doit croiser ces caractéristiques ; l'assistant doit pouvoir
retrouver les produits pertinents pour une question.
En deux semaines : un prototype en semaine 1, un produit plus fonctionnel en semaine 2. La base
doit être identique en développement et en production, et démarrer avec le
reste du projet par `compose.yaml`.

## Options

1. PostgreSQL 17 seul : même version en dev et en prod via Docker. Relations
   entre produits, catégories et applications ; type `jsonb` pour les
   caractéristiques qui varient d'un produit à l'autre ; transactions pour
   les commandes ; recherche par similarité possible avec l'extension
   pgvector. Un conteneur de plus, et un schéma à maintenir.
2. MongoDB : schéma souple, adapté aux caractéristiques variables. Mais les
   relations entre produits, catégories et applications, et les comparaisons
   croisées, demandent plus de code côté API.
3. PostgreSQL + base vectorielle dédiée (Qdrant) : recherche par similarité
   plus avancée pour l'assistant. Deux bases à faire tourner et à garder
   synchronisées.

## Décision

Nous choisissons PostgreSQL 17 seul parce qu'il couvre dans une même base
les données liées du catalogue, les caractéristiques variables des produits
(`jsonb`), les transactions des commandes et, si l'assistant en a besoin,
la recherche par similarité (pgvector).

## Conséquences

- Positives : une seule base pour les fiches, le comparateur et l'assistant ;
  si l'assistant a besoin d'une recherche par similarité, pgvector s'ajoute
  sans nouveau service.
- Négatives, à accepter : un conteneur à démarrer avant l'API ; un schéma et
  des données de test à maintenir.
- À revoir si : l'hébergeur impose un autre moteur, ou si la recherche de
  l'assistant dépasse ce que pgvector permet.
