// Les scénarios du fournisseur fictif (AI_PROVIDER=mock) : des réponses
// simulées, au format exact de l'answer du service Data/IA. Les ingrédients
// et leurs références sont ceux du catalogue Givaudan. Chaque réponse le dit
// dans limites_catalogue : elle n'a pas été produite par l'IA.

export const MENTION_SIMULEE = 'Réponse simulée (AI_PROVIDER=mock)';

export type MockScenario = {
  id: 'tropical' | 'plage' | 'epices' | 'vague';
  // Un souvenir d'exemple qui mène à ce scénario (repris par le front)
  exemple: string;
  // En minuscules et sans accents. Un mot-clé reconnaît le début d'un mot ;
  // ceux de 3 lettres ou moins, seulement le mot entier (voir ai.mock.ts)
  motsCles: string[];
  answer: Record<string, unknown>;
};

function note(ingredient: string, reference: string, raison: string) {
  return { ingredient, reference, raison, sources: [] };
}

const TROPICAL: MockScenario = {
  id: 'tropical',
  exemple:
    "Un hôtel en Thaïlande, au milieu de la végétation, juste après la pluie. L'air était chaud et humide, des fleurs blanches partout, une odeur de bois mouillé. Je me sentais apaisée.",
  motsCles: ['pluie', 'tropi', 'thailande', 'jungle', 'vegetation', 'humide'],
  answer: {
    comprehension: {
      lieu: 'Tropiques, hôtel refuge',
      moment: 'Après la pluie',
      meteo: 'Chaleur humide',
      emotion: 'Apaisement',
      elements: ['feuillage mouillé', 'fleurs blanches', 'bois mouillé'],
    },
    signature: {
      nom: "Fraîcheur après l'averse",
      description:
        'Un vert humide et lumineux, adouci de fleurs blanches, posé sur un bois tiède.',
    },
    roue: [
      { famille: 'Green', pourcentage: 40 },
      { famille: 'Floral', pourcentage: 30 },
      { famille: 'Woody', pourcentage: 20 },
      { famille: 'Marine', pourcentage: 10 },
    ],
    profil: {
      tete: [
        note(
          'Anther',
          '5846393',
          'Le vert éclatant du feuillage encore mouillé.',
        ),
        note(
          'Ultrazur™',
          '21218823',
          "L'air saturé d'eau juste après l'averse.",
        ),
      ],
      coeur: [
        note(
          'Jasmone Cis',
          '6340001',
          'Les fleurs blanches qui s’ouvrent dans la chaleur humide.',
        ),
        note(
          'Isojasmone B 11',
          '6249003',
          'Le jasmin un peu vert des jardins de l’hôtel.',
        ),
      ],
      fond: [
        note('Javanol™', '8754013', 'Le bois tiède des terrasses de l’hôtel.'),
        note('Ebanol™', '4697403', 'L’odeur douce du bois mouillé.'),
      ],
    },
    limites_catalogue: [MENTION_SIMULEE],
    informations_manquantes: [],
    brief:
      'Un parfum vert et floral qui évoque un refuge tropical après la pluie : ouverture verte et humide, cœur de fleurs blanches, fond boisé tiède.',
  },
};

const PLAGE: MockScenario = {
  id: 'plage',
  exemple:
    'Une plage en Bretagne au petit matin, le vent salé, les embruns sur le visage, le sable encore frais. Je me sentais libre.',
  motsCles: ['plage', 'mer', 'ocean', 'embruns', 'sable', 'vague', 'sel'],
  answer: {
    comprehension: {
      lieu: 'Bord de mer, plage',
      moment: 'Petit matin',
      meteo: 'Vent frais, embruns',
      emotion: 'Liberté, sérénité',
      elements: ['embruns', 'sable frais', 'vent salé'],
    },
    signature: {
      nom: 'Plage au matin',
      description:
        'Un air marin vif et salé, éclairé d’agrumes, sur la chaleur douce du sable.',
    },
    roue: [
      { famille: 'Marine', pourcentage: 40 },
      { famille: 'Citrus', pourcentage: 25 },
      { famille: 'Ambery', pourcentage: 20 },
      { famille: 'Woody', pourcentage: 15 },
    ],
    profil: {
      tete: [
        note(
          'Ultrazur™',
          '21218823',
          'Les embruns portés par le vent du matin.',
        ),
        note('Decatone', '4356101', 'La fraîcheur vive de l’air salé.'),
      ],
      coeur: [
        note(
          'Adoxal',
          '1028001',
          'L’éclat lumineux de la mer au lever du jour.',
        ),
      ],
      fond: [
        note(
          'Ambermax™ 10%/TEC',
          '1472033',
          'La chaleur minérale du sable qui sèche.',
        ),
        note('Ebanol™', '4697403', 'Le bois flotté échoué sur la plage.'),
      ],
    },
    limites_catalogue: [MENTION_SIMULEE],
    informations_manquantes: [],
    brief:
      'Un parfum marin et hespéridé qui évoque une plage bretonne au petit matin : tête d’embruns, cœur lumineux, fond ambré et boisé.',
  },
};

const EPICES: MockScenario = {
  id: 'epices',
  exemple:
    "Le marché aux épices de Marrakech en fin de journée, le safran, la cannelle, les oranges confites. C'était chaleureux et un peu étourdissant.",
  motsCles: [
    'epice',
    'souk',
    'marche',
    'safran',
    'cannelle',
    'vanille',
    'gateau',
  ],
  answer: {
    comprehension: {
      lieu: 'Souk, marché aux épices',
      moment: 'Fin de journée',
      meteo: 'Chaleur sèche',
      emotion: 'Chaleur, étourdissement joyeux',
      elements: ['safran', 'cannelle', 'oranges confites'],
    },
    signature: {
      nom: 'Souk au crépuscule',
      description:
        'Des épices chaudes et un fruit confit, adoucis de fleur d’oranger, dans la lumière du soir.',
    },
    roue: [
      { famille: 'Spicy', pourcentage: 40 },
      { famille: 'Gourmand', pourcentage: 35 },
      { famille: 'Floral', pourcentage: 25 },
    ],
    profil: {
      tete: [
        note('Safranal', '8797001', 'Le safran des étals, chaud et cuiré.'),
      ],
      coeur: [
        note(
          'Methyl Diantilis™',
          '6906203',
          'La note épicée et douce de la cannelle.',
        ),
        note(
          'Oranger Crystals',
          '7758003',
          'La fleur d’oranger des oranges confites.',
        ),
      ],
      fond: [
        note(
          'Isobutavan',
          '1465543',
          'La douceur vanillée des confiseries du souk.',
        ),
        note(
          'Azarbre',
          '7043003',
          'Le fond chaud et sec de la fin de journée.',
        ),
      ],
    },
    limites_catalogue: [MENTION_SIMULEE],
    informations_manquantes: [],
    brief:
      'Un parfum épicé et gourmand qui évoque un souk de Marrakech au crépuscule : safran en tête, cannelle et fleur d’oranger au cœur, fond vanillé.',
  },
};

// Par défaut : un souvenir trop vague pour une analyse riche
const VAGUE: MockScenario = {
  id: 'vague',
  exemple: "Un souvenir d'enfance chez ma grand-mère.",
  motsCles: [],
  answer: {
    comprehension: {
      lieu: 'Maison familiale',
      moment: '',
      meteo: '',
      emotion: 'Nostalgie',
      elements: [],
    },
    signature: {
      nom: 'Maison d’enfance',
      description:
        'Une douceur familière et rassurante, à préciser avec plus de détails.',
    },
    roue: [
      { famille: 'Gourmand', pourcentage: 60 },
      { famille: 'Floral', pourcentage: 40 },
    ],
    profil: {
      tete: [],
      coeur: [
        note(
          'Oranger Crystals',
          '7758003',
          'La fleur d’oranger d’une cuisine de grand-mère.',
        ),
      ],
      fond: [
        note(
          'Isobutavan',
          '1465543',
          'La douceur vanillée d’un goûter d’enfance.',
        ),
      ],
    },
    limites_catalogue: [MENTION_SIMULEE],
    informations_manquantes: [
      'Le moment ou la saison',
      'Ce que vous sentiez : une odeur, une matière',
      "Le temps qu'il faisait",
    ],
    brief:
      'Un parfum doux, gourmand et floral qui évoque la maison d’une grand-mère, à préciser avec le moment et les odeurs du souvenir.',
  },
};

// Dans l'ordre de priorité, en cas d'égalité ; « vague » en dernier
export const SCENARIOS: MockScenario[] = [TROPICAL, PLAGE, EPICES, VAGUE];
export const SCENARIO_PAR_DEFAUT = VAGUE;
