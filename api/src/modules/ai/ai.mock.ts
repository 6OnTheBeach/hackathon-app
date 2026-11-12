// Fournisseur fictif (AI_PROVIDER=mock) : une réponse fixe, au format de
// l'answer du service Data/IA, plausible pour un souvenir de forêt tropicale
// après la pluie. Permet de développer le front sans le service Data/IA.
// Les familles de la roue sont celles du catalogue ; leur somme fait 100.
const MOCK_ANSWER = {
  comprehension: {
    lieu: 'Forêt tropicale',
    moment: "Fin d'après-midi, juste après l'averse",
    meteo: 'Pluie chaude qui vient de cesser, air saturé d’humidité',
    emotion: 'Apaisement, émerveillement',
    elements: [
      'terre mouillée',
      'feuillage dense',
      'fleurs blanches',
      'mousse sur les troncs',
      'écorce humide',
    ],
  },
  signature: {
    nom: 'Canopée après l’averse',
    description:
      'Un vert éclatant et humide, porté par des fleurs blanches qui s’ouvrent sous la pluie, sur un fond boisé et terreux.',
  },
  roue: [
    { famille: 'Green', pourcentage: 35 },
    { famille: 'Floral', pourcentage: 20 },
    { famille: 'Woody', pourcentage: 20 },
    { famille: 'Leather - Moss', pourcentage: 15 },
    { famille: 'Marine', pourcentage: 10 },
  ],
  profil: {
    tete: [
      {
        ingredient: 'Feuille de violette',
        reference: 'MOCK-001',
        raison: 'L’éclat vert et humide des feuilles juste après la pluie.',
        sources: [],
      },
      {
        ingredient: 'Notes aquatiques',
        reference: 'MOCK-002',
        raison: 'L’air saturé d’eau et la fraîcheur de l’averse.',
        sources: [],
      },
    ],
    coeur: [
      {
        ingredient: 'Jasmin sambac',
        reference: 'MOCK-003',
        raison: 'Les fleurs blanches qui s’ouvrent dans la chaleur humide.',
        sources: [],
      },
    ],
    fond: [
      {
        ingredient: 'Vétiver',
        reference: 'MOCK-004',
        raison: 'La terre mouillée et les racines.',
        sources: [],
      },
      {
        ingredient: 'Mousse de chêne',
        reference: 'MOCK-005',
        raison: 'La mousse sur les troncs et l’écorce humide.',
        sources: [],
      },
    ],
  },
  limites_catalogue: [
    'Réponse fictive (AI_PROVIDER=mock) : les références ne sont pas celles du catalogue.',
  ],
  informations_manquantes: [],
  brief:
    'Parfum vert et floral évoquant une forêt tropicale après la pluie : ouverture verte et aquatique, cœur de fleurs blanches, fond boisé et moussu.',
};

// Même forme que askDataAi : la réponse passe par la même validation. Le
// souvenir n'est pas lu : la réponse est la même quel qu'il soit.
export async function analyzeMock(): Promise<{
  answer: unknown;
  model: string;
}> {
  // Une courte attente, pour voir l'indicateur de chargement du front
  await new Promise((resolve) => setTimeout(resolve, 800));
  // Une copie : l'appelant peut la modifier sans altérer la réponse fixe
  return { answer: structuredClone(MOCK_ANSWER), model: 'mock' };
}
