# 0005. Accéder à PostgreSQL avec Drizzle ORM et le pilote node-postgres

- Statut : acceptée
- Date : 2026-11-11
- Décideurs : Amaury (CTO / tech-lead)

## Contexte

La base est PostgreSQL 17 (voir [0002](0002-base-de-donnees.md)). Elle stocke
les parcours Scent Journey : les messages échangés avec l'IA, la perception
qu'elle en tire (rangée en `jsonb`, son contenu variant d'un souvenir à
l'autre), puis le profil olfactif et le brief. La recherche par similarité
avec pgvector reste possible si l'IA en a besoin. L'API est en TypeScript sur
Node 24 (voir [0001](0001-TypeScript.md)) et écrite avec Express (voir
[0004](0004-framework-api.md)).
Le schéma va évoluer pendant le hackathon, au fil des étapes du parcours.
Or les scripts de `db/init/` ne sont joués qu'au premier démarrage de la base :
ils ne suffisent pas à faire évoluer le schéma d'une base existante.
Il faut donc une façon d'écrire les requêtes et de faire évoluer le schéma
(migrations), identique en développement, en CI et dans `compose.yaml`.
Drizzle a déjà été utilisé sur un projet précédent ; pg seul ne l'a jamais
été directement.

## Options

1. pg (node-postgres) seul : le pilote PostgreSQL, sans autre couche ; SQL
   écrit à la main, toutes les fonctionnalités de PostgreSQL disponibles.
   Le type des résultats est à écrire et à tenir à jour à la main, et les
   migrations demandent un outil à choisir ou un script à écrire.
2. Drizzle ORM (`drizzle-orm`, avec le pilote pg) et drizzle-kit : schéma
   décrit en TypeScript, requêtes typées proches du SQL, et `sql` brut
   possible. Types de colonnes `jsonb` et `vector` (pgvector) disponibles.
   drizzle-kit génère des migrations en SQL lisible, versionnées dans le
   dépôt. Pas encore en 1.0 : la version stable est la 0.45, la 1.0 étant
   en préversion.
3. Prisma : schéma dans son propre langage (`schema.prisma`), client typé
   généré par une commande à relancer à chaque changement du schéma,
   migrations générées.

## Décision

Nous choisissons l'option 2, Drizzle ORM avec le pilote node-postgres,
parce qu'il est déjà maîtrisé, ce qui permet d'avancer dès le premier jour,
et que ses migrations font évoluer une base existante sans la recréer, alors
que le schéma changera à chaque étape du parcours. Son schéma en TypeScript
reste cohérent avec le reste de l'API (0001), et il prend en charge `jsonb`
et pgvector (0002).
Les migrations sont appliquées par l'API à son démarrage ; `db/init/` ne
garde que l'activation de pgvector.

## Conséquences

- Positives : un outil déjà maîtrisé ; les résultats des requêtes sont typés
  à partir du schéma ; les changements du schéma sont relus en pull request
  sous forme de SQL ; une base existante se met à jour au démarrage de l'API,
  sans la recréer.
- Négatives, à accepter :
  - une dépendance encore en version 0.x ;
  - le migrateur n'applique une migration que si elle est plus récente que la
    dernière appliquée : une migration générée sur une branche, puis fusionnée
    après une migration plus récente, serait ignorée sans erreur. Il faut la
    régénérer après avoir récupéré `develop`.
- À revoir si : la version 1.0 de Drizzle impose une migration du projet ;
  ou si l'API doit tourner en plusieurs instances, ce qui demanderait
  d'appliquer les migrations à part, avant le démarrage.
