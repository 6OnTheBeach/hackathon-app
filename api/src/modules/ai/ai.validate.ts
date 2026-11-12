import type {
  Analysis,
  Comprehension,
  Profil,
  ProfilNote,
  RoueEntry,
  Signature,
} from './ai.types.ts';

// Vérifie, à la main, que l'answer de l'IA a le format attendu (Analysis).
// Obligatoires : comprehension, signature, roue. Facultatif : profil (ignoré
// s'il est mal formé). Absents : listes vides et brief vide.
// Renvoie l'analyse, ou la liste des problèmes trouvés.

type Result =
  { ok: true; analysis: Analysis } | { ok: false; problems: string[] };

type Obj = Record<string, unknown>;

function isObject(value: unknown): value is Obj {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === 'string');
}

// Champ texte obligatoire d'un objet
function str(obj: Obj, key: string, path: string, problems: string[]): string {
  const value = obj[key];
  if (typeof value !== 'string') {
    problems.push(`${path}.${key} : texte attendu`);
    return '';
  }
  return value;
}

function parseComprehension(value: unknown, problems: string[]): Comprehension {
  if (!isObject(value)) {
    problems.push('comprehension : objet attendu');
    return { lieu: '', moment: '', meteo: '', emotion: '', elements: [] };
  }
  const p = 'comprehension';
  return {
    lieu: str(value, 'lieu', p, problems),
    moment: str(value, 'moment', p, problems),
    meteo: str(value, 'meteo', p, problems),
    emotion: str(value, 'emotion', p, problems),
    elements: parseElements(value.elements),
  };
}

// Les petits modèles respectent mal ce champ : on le rend tolérant.
// Un texte est découpé sur les virgules ; une liste voit chaque élément
// converti en texte ; toute autre forme donne une liste vide (avec un
// avertissement dans les logs).
export function parseElements(value: unknown): string[] {
  if (typeof value === 'string') return clean(value.split(','));
  if (Array.isArray(value)) return clean(value.map(toText));
  console.warn(
    `[ai] comprehension.elements ignoré : liste de textes attendue, reçu ${describe(value)}`,
  );
  return [];
}

function toText(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  if (isObject(value)) {
    // {"nom": "sable", "detail": "chaud"} → "sable chaud"
    return Object.values(value)
      .filter((v) => ['string', 'number', 'boolean'].includes(typeof v))
      .map(String)
      .join(' ');
  }
  return '';
}

function clean(texts: string[]): string[] {
  return texts.map((t) => t.trim()).filter((t) => t !== '');
}

function describe(value: unknown): string {
  if (value === undefined) return 'rien';
  if (value === null) return 'null';
  return typeof value;
}

function parseSignature(value: unknown, problems: string[]): Signature {
  if (!isObject(value)) {
    problems.push('signature : objet attendu');
    return { nom: '', description: '' };
  }
  return {
    nom: str(value, 'nom', 'signature', problems),
    description: str(value, 'description', 'signature', problems),
  };
}

function parseRoue(value: unknown, problems: string[]): RoueEntry[] {
  if (!Array.isArray(value) || value.length === 0) {
    problems.push('roue : liste non vide attendue');
    return [];
  }
  return value.map((entry, i) => {
    const p = `roue[${i}]`;
    if (!isObject(entry)) {
      problems.push(`${p} : objet attendu`);
      return { famille: '', pourcentage: 0 };
    }
    const pourcentage = entry.pourcentage;
    if (typeof pourcentage !== 'number' || !Number.isFinite(pourcentage)) {
      problems.push(`${p}.pourcentage : nombre attendu`);
    }
    return {
      famille: str(entry, 'famille', p, problems),
      pourcentage: typeof pourcentage === 'number' ? pourcentage : 0,
    };
  });
}

// Le profil est facultatif : une note mal formée invalide tout le profil,
// qui est alors simplement omis (avec un avertissement dans les logs)
function parseProfil(value: unknown): Profil | undefined {
  if (value === undefined || value === null) return undefined;
  if (!isObject(value)) return warnProfil('objet attendu');

  const notes = (key: 'tete' | 'coeur' | 'fond'): ProfilNote[] | undefined => {
    const list = value[key] ?? [];
    if (!Array.isArray(list)) return undefined;
    const parsed: ProfilNote[] = [];
    for (const note of list) {
      if (!isObject(note) || typeof note.ingredient !== 'string') {
        return undefined;
      }
      parsed.push({
        ingredient: note.ingredient,
        reference: typeof note.reference === 'string' ? note.reference : '',
        raison: typeof note.raison === 'string' ? note.raison : '',
        sources: isStringArray(note.sources) ? note.sources : [],
      });
    }
    return parsed;
  };

  const tete = notes('tete');
  const coeur = notes('coeur');
  const fond = notes('fond');
  if (!tete || !coeur || !fond) return warnProfil('notes mal formées');
  return { tete, coeur, fond };
}

function warnProfil(reason: string): undefined {
  console.warn(`[ai] profil ignoré : ${reason}`);
  return undefined;
}

export function parseAnalysis(answer: unknown): Result {
  if (typeof answer === 'string') {
    return {
      ok: false,
      problems: [
        "answer est un texte : le modèle n'a pas renvoyé un JSON valide",
      ],
    };
  }
  if (!isObject(answer)) {
    return { ok: false, problems: ['answer : objet attendu'] };
  }

  const problems: string[] = [];
  const comprehension = parseComprehension(answer.comprehension, problems);
  const signature = parseSignature(answer.signature, problems);
  const roue = parseRoue(answer.roue, problems);
  if (problems.length > 0) return { ok: false, problems };

  const profil = parseProfil(answer.profil);
  return {
    ok: true,
    analysis: {
      comprehension,
      signature,
      roue,
      ...(profil ? { profil } : {}),
      limites_catalogue: isStringArray(answer.limites_catalogue)
        ? answer.limites_catalogue
        : [],
      informations_manquantes: isStringArray(answer.informations_manquantes)
        ? answer.informations_manquantes
        : [],
      brief: typeof answer.brief === 'string' ? answer.brief : '',
    },
  };
}
