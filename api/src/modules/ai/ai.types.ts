// L'analyse d'un souvenir, au format du champ answer du service Data/IA
// (prompt de api.py, dépôt rag-g24). Schéma Analysis d'openapi.yaml.

export type Comprehension = {
  lieu: string;
  moment: string;
  meteo: string;
  emotion: string;
  elements: string[];
};

export type Signature = { nom: string; description: string };

export type RoueEntry = { famille: string; pourcentage: number };

export type ProfilNote = {
  ingredient: string;
  reference: string;
  raison: string;
  sources: string[];
};

export type Profil = {
  tete: ProfilNote[];
  coeur: ProfilNote[];
  fond: ProfilNote[];
};

export type Analysis = {
  comprehension: Comprehension;
  signature: Signature;
  roue: RoueEntry[];
  // Facultatif : affiché seulement s'il est présent
  profil?: Profil;
  limites_catalogue: string[];
  informations_manquantes: string[];
  brief: string;
};

// Ce que renvoie un fournisseur : l'analyse et le modèle qui l'a produite
export type AnalyzeResult = { analysis: Analysis; model: string };

// Une défaillance de l'IA, attendue (injoignable, trop lente, réponse
// invalide) : la route la traduit en 502. message est montré au client ;
// le détail technique reste dans les logs.
export class AiError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'AiError';
  }
}
