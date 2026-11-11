# 0001 - Développer l'API et le front en TypeScript, en deux applications séparées

- Statut : acceptée
- Date : 2026-11-09
- Décideurs : Amaury (CTO / tech-lead)

## Contexte

Givaudan veut une plateforme B2B qui aide ses clients professionnels à
commander : comprendre leurs besoins techniques, trouver les bonnes
références et les guider de la recherche à la validation de la commande.
Le produit attendu comprend des fiches produits enrichies, un assistant IA
explicatif et un comparateur.
Le hackathon dure deux semaines : un prototype en semaine 1, un produit plus
fonctionnel en semaine 2.
Le dev container est en place sur Node 24 (Debian trixie), la même base que
l'image de production prévue. Le contrat de l'API doit être décrit dans un
fichier OpenAPI.

## Options

1. API Node (TypeScript) + front React avec Vite, séparés, dans un même
   dépôt : un seul langage, types partagés, contrat explicite entre le front
   et l'API via OpenAPI. Deux applications à lancer.
2. Next.js, front et API dans une seule application : une seule application
   à lancer et à déployer, pratique pour un prototype. Le front et l'API sont
   couplés, et les routes d'API se décrivent mal dans un contrat OpenAPI
   séparé.
3. API Python (FastAPI) + front TypeScript : écosystème IA plus riche et
   OpenAPI généré automatiquement. Deux langages et deux outillages, alors
   que personne d'autre ne codera en Python ; dev container à adapter.

## Décision

Nous choisissons l'option 1 pour deux raisons :

- tout est en TypeScript, et le dev container est déjà prêt pour Node 24 ;
- le front ne dépend que du contrat OpenAPI de l'API : en semaine 1, l'API
  peut renvoyer des données fictives, puis être branchée sur la base et l'IA
  en semaine 2 sans modifier le front.

## Conséquences

- Positives : un seul langage et une seule chaîne de qualité ; les fiches
  produits, le comparateur et l'assistant IA passent par la même API.
- Négatives, à accepter : deux applications à lancer et à maintenir,
  orchestrées par `compose.yaml` ; l'assistant IA passe par le SDK
  TypeScript du fournisseur, sans les bibliothèques Python de traitement
  de données.
- À revoir si : la recherche dans le catalogue demande un traitement que
  seul l'écosystème Python couvre bien.
