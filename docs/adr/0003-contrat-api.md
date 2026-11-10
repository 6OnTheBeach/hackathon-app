# 0003 - Décrire le contrat de l'API dans openapi.yaml, écrit avant le code

- Statut : acceptée
- Date : 2026-11-10
- Décideurs : Amaury (CTO / tech-lead)

## Contexte

L'API doit servir trois usages au front : les fiches produits enrichies, le
comparateur et l'assistant IA explicatif (voir 0001). Au moment de cette
décision, ni l'API ni le front ne sont écrits. Le prototype de la semaine 1
doit pouvoir avancer côté front avant que l'API soit branchée sur la base
(voir 0002) et sur l'IA. Le format des échanges entre le front et l'API doit
donc être fixé avant d'écrire l'un ou l'autre.

## Options

1. Contrat écrit à la main dans `openapi.yaml`, avant le code : un fichier
   lisible par toute l'équipe sans lancer l'API, et relu en pull request ;
   le front peut être construit sur le contrat avant que l'API existe.
   Le fichier doit être tenu à jour à la main quand le code change.
2. Contrat généré à partir du code de l'API, affiché sur `/docs` : pas de
   double écriture. Le contrat n'existe qu'une fois l'API écrite, et il
   n'est lisible que lorsque l'API tourne, sauf à l'exporter.
3. Pas de contrat : types TypeScript partagés directement entre le front et
   l'API. Le plus rapide, mais aucun document lisible sans lire le code, et
   seul notre front peut appeler l'API.

## Décision

Nous choisissons l'option 1 : le contrat de référence est `openapi.yaml`,
à la racine du dépôt. Les routes sont décrites dans ce fichier avant d'être
codées, parce que l'API et le front n'existent pas encore et qu'un contrat
écrit permet de construire le front sans attendre l'API.

## Conséquences

- Positives : le front peut avancer sur des données fictives conformes au
  contrat ; Product et Data/IA peuvent lire ce que l'API expose sans lancer
  le code ; toute modification du contrat passe par une pull request.
- Négatives, à accepter : le fichier peut diverger du code s'il n'est pas
  mis à jour ; chaque nouvelle route s'écrit deux fois (contrat, puis code).
- À revoir si : le contrat diverge régulièrement du code, ou si sa
  maintenance coûte plus de temps qu'elle n'en fait gagner. Dans ce cas,
  passer à l'option 2 en exportant le contrat généré dans `openapi.yaml`.
