// Données de démonstration : les pistes « imaginées par nos parfumeurs »
// (écran 07). Aucune route de l'API ne les fournit : elles sont simulées
// ici, une liste par scénario du fournisseur fictif de l'API
// (api/src/modules/ai/mock-scenarios.ts). Familles parmi celles de la roue ;
// matières parmi les ingrédients du catalogue utilisés par ces scénarios.
import boisFlotte from '../assets/explorer-bois-flotte.png';
import agrumes from '../assets/explorer-agrumes.png';
import epices from '../assets/explorer-epices.png';
import fleursBlanches from '../assets/explorer-fleurs-blanches.png';
import frangipanier from '../assets/explorer-frangipanier.png';
import sousLeau from '../assets/explorer-sous-l-eau.png';
import pluie from '../assets/brief-pluie.png';
import interieur from '../assets/produit-interieur.png';

export type PisteDemo = {
  // Unique d'un scénario à l'autre : la commande les mélange sans erreur
  id: string;
  lettre: string;
  nom: string;
  citation: string;
  // Les familles et leur part (total 100)
  composition: { famille: string; pourcentage: number }[];
  matieres: string[];
  photo: string;
};

// Les couleurs des familles, reprises de la roue de la maquette
export const COULEURS_FAMILLES: Record<string, string> = {
  Green: '#3b6c8f',
  Floral: '#78608d',
  Woody: '#9a6633',
  Marine: '#4e8a7a',
  Citrus: '#c9a227',
  Ambery: '#b5713a',
  Spicy: '#a3442f',
  Gourmand: '#8a5a3c',
};

const TROPICAL: PisteDemo[] = [
  {
    id: 'tropical-A',
    lettre: 'A',
    nom: 'Pluie de jade',
    citation:
      'Une ouverture très aérienne, au plus près de l’air juste après l’averse.',
    composition: [
      { famille: 'Green', pourcentage: 50 },
      { famille: 'Marine', pourcentage: 30 },
      { famille: 'Floral', pourcentage: 20 },
    ],
    matieres: ['Anther', 'Ultrazur™', 'Jasmone Cis'],
    photo: pluie,
  },
  {
    id: 'tropical-B',
    lettre: 'B',
    nom: 'Pétales mouillés',
    citation:
      'Les fleurs blanches au premier plan, portées par une fraîcheur humide.',
    composition: [
      { famille: 'Floral', pourcentage: 45 },
      { famille: 'Green', pourcentage: 35 },
      { famille: 'Woody', pourcentage: 20 },
    ],
    matieres: ['Isojasmone B 11', 'Jasmone Cis', 'Javanol™'],
    photo: frangipanier,
  },
];

const PLAGE: PisteDemo[] = [
  {
    id: 'plage-A',
    lettre: 'A',
    nom: 'Embruns',
    citation: 'Le vent salé qui fouette le visage, vif et lumineux.',
    composition: [
      { famille: 'Marine', pourcentage: 55 },
      { famille: 'Citrus', pourcentage: 30 },
      { famille: 'Woody', pourcentage: 15 },
    ],
    matieres: ['Ultrazur™', 'Decatone', 'Ebanol™'],
    photo: sousLeau,
  },
  {
    id: 'plage-B',
    lettre: 'B',
    nom: 'Zeste de marée',
    citation: 'Une fraîcheur pétillante d’agrumes, portée par l’air marin.',
    composition: [
      { famille: 'Citrus', pourcentage: 45 },
      { famille: 'Marine', pourcentage: 35 },
      { famille: 'Ambery', pourcentage: 20 },
    ],
    matieres: ['Decatone', 'Adoxal', 'Ambermax™ 10%/TEC'],
    photo: agrumes,
  },
  {
    id: 'plage-C',
    lettre: 'C',
    nom: 'Sable tiède',
    citation:
      'Un sillage plus doux\u00A0: le sable qui se réchauffe au soleil.',
    composition: [
      { famille: 'Ambery', pourcentage: 45 },
      { famille: 'Woody', pourcentage: 30 },
      { famille: 'Marine', pourcentage: 25 },
    ],
    matieres: ['Ambermax™ 10%/TEC', 'Ebanol™', 'Ultrazur™'],
    photo: boisFlotte,
  },
];

const EPICES: PisteDemo[] = [
  {
    id: 'epices-A',
    lettre: 'A',
    nom: 'Safran doré',
    citation: 'Les étals de safran en pleine lumière, chauds et vibrants.',
    composition: [
      { famille: 'Spicy', pourcentage: 55 },
      { famille: 'Floral', pourcentage: 25 },
      { famille: 'Gourmand', pourcentage: 20 },
    ],
    matieres: ['Safranal', 'Methyl Diantilis™', 'Isobutavan'],
    photo: epices,
  },
  {
    id: 'epices-B',
    lettre: 'B',
    nom: 'Orange confite',
    citation:
      'La douceur des fruits confits, relevée d’une pointe de cannelle.',
    composition: [
      { famille: 'Gourmand', pourcentage: 50 },
      { famille: 'Floral', pourcentage: 30 },
      { famille: 'Spicy', pourcentage: 20 },
    ],
    matieres: ['Oranger Crystals', 'Isobutavan', 'Methyl Diantilis™'],
    photo: agrumes,
  },
  {
    id: 'epices-C',
    lettre: 'C',
    nom: 'Ombre du souk',
    citation:
      'Un sillage plus profond\u00A0: la chaleur des ruelles à la nuit.',
    composition: [
      { famille: 'Spicy', pourcentage: 40 },
      { famille: 'Ambery', pourcentage: 35 },
      { famille: 'Gourmand', pourcentage: 25 },
    ],
    matieres: ['Safranal', 'Azarbre', 'Isobutavan'],
    photo: interieur,
  },
];

const VAGUE: PisteDemo[] = [
  {
    id: 'vague-A',
    lettre: 'A',
    nom: 'Goûter d’enfance',
    citation:
      'Une douceur rassurante, que nous affinerons avec vous à partir de votre souvenir.',
    composition: [
      { famille: 'Gourmand', pourcentage: 60 },
      { famille: 'Floral', pourcentage: 40 },
    ],
    matieres: ['Isobutavan', 'Oranger Crystals'],
    photo: fleursBlanches,
  },
];

// Le scénario est reconnu au nom de sa signature, tel que l'API mock le
// renvoie (signature.nom de mock-scenarios.ts) : à garder identiques
const PISTES_PAR_SIGNATURE: Record<string, PisteDemo[]> = {
  "Fraîcheur après l'averse": TROPICAL,
  'Plage au matin': PLAGE,
  'Souk au crépuscule': EPICES,
  'Maison d’enfance': VAGUE,
};

// Les pistes simulées pour cette signature ; aucune si elle ne vient pas
// d'un scénario du mock (par exemple une réponse de la vraie IA)
export function pistesPour(signature: string): PisteDemo[] {
  return PISTES_PAR_SIGNATURE[signature] ?? [];
}
