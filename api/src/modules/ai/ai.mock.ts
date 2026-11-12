import {
  SCENARIO_PAR_DEFAUT,
  SCENARIOS,
  type MockScenario,
} from './mock-scenarios.ts';

// Fournisseur fictif (AI_PROVIDER=mock) : une réponse simulée, choisie parmi
// quelques scénarios selon les mots du souvenir. Permet de développer et de
// démontrer le front sans le service Data/IA ; chaque réponse se déclare
// simulée (model « mock », mention dans limites_catalogue).

// Minuscules, sans accents, découpé en mots
function mots(text: string): string[] {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((m) => m !== '');
}

// Un mot-clé reconnaît le début d'un mot (« tropi » → « tropiques ») ; s'il
// fait 3 lettres ou moins, seulement le mot entier : « mer » ne doit pas
// reconnaître « grand-mère », ni « sel » « selon »
function reconnait(motCle: string, mot: string): boolean {
  return motCle.length <= 3 ? mot === motCle : mot.startsWith(motCle);
}

// Le scénario dont le souvenir contient le plus de mots-clés (à égalité, le
// premier de SCENARIOS) ; aucun → le scénario par défaut, « vague »
export function choisirScenario(text: string): MockScenario {
  const lus = mots(text);
  let meilleur = SCENARIO_PAR_DEFAUT;
  let score = 0;
  for (const scenario of SCENARIOS) {
    const trouves = scenario.motsCles.filter((k) =>
      lus.some((m) => reconnait(k, m)),
    ).length;
    if (trouves > score) {
      meilleur = scenario;
      score = trouves;
    }
  }
  return meilleur;
}

// Même forme que askDataAi : la réponse passe par la même validation
export async function analyzeMock(text: string): Promise<{
  answer: unknown;
  model: string;
}> {
  // Une courte attente, pour voir l'indicateur de chargement du front
  await new Promise((resolve) => setTimeout(resolve, 800));
  // Une copie : l'appelant peut la modifier sans altérer le scénario
  return {
    answer: structuredClone(choisirScenario(text).answer),
    model: 'mock',
  };
}
