import type { ModeLivraison } from './pages/Livraison.tsx';

// Les dates du suivi de l'écran 10 · Commande confirmée, calculées à partir de
// la date de confirmation et du mode de livraison. Fonctions pures, sans
// React : rien n'est enregistré, rien ne vient de l'API

// Les délais du ticket, en jours ouvrés après la confirmation. null : la
// date est à convenir avec l'interlocuteur (remise en main propre)
const DELAIS: Record<
  ModeLivraison,
  { expediee: number; livree: number } | null
> = {
  standard: { expediee: 1, livree: 5 },
  express: { expediee: 1, livree: 2 },
  'main-propre': null,
};

export type DatesSuivi = {
  // Le jour de la confirmation
  confirmee: Date;
  // null : « À convenir »
  expediee: Date | null;
  livree: Date | null;
};

// Le même jour, à minuit, en heure locale : on compte en jours, pas en heures
function jour(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

// Un jour ouvré : du lundi au vendredi. Les jours fériés ne sont pas sautés
export function estOuvre(date: Date): boolean {
  const j = date.getDay();
  return j !== 0 && j !== 6;
}

// Le n-ième jour ouvré après la date : une confirmation un vendredi ou un
// samedi donne le lundi à J+1 ouvré
export function ajouterJoursOuvres(date: Date, n: number): Date {
  const resultat = jour(date);
  let restants = n;
  while (restants > 0) {
    resultat.setDate(resultat.getDate() + 1);
    if (estOuvre(resultat)) restants -= 1;
  }
  return resultat;
}

export function datesSuivi(
  confirmation: Date,
  mode: ModeLivraison,
): DatesSuivi {
  const delais = DELAIS[mode];
  return {
    confirmee: jour(confirmation),
    expediee: delais && ajouterJoursOuvres(confirmation, delais.expediee),
    livree: delais && ajouterJoursOuvres(confirmation, delais.livree),
  };
}

// La valeur de <time dateTime> : « 2026-11-17 », en heure locale
export function cleJour(date: Date): string {
  const mois = String(date.getMonth() + 1).padStart(2, '0');
  const j = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${mois}-${j}`;
}

const COURT = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'short',
});
const LONG = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

// Intl écrit « 1 déc. » : on écrit « 1er déc. », comme en français
function formater(format: Intl.DateTimeFormat, date: Date): string {
  return format
    .formatToParts(date)
    .map((p) => (p.type === 'day' && p.value === '1' ? '1er' : p.value))
    .join('');
}

// « 12 nov. », « 1er déc. » : dans le suivi
export function dateCourte(date: Date): string {
  return formater(COURT, date);
}

// « 17 novembre 2026 », « 1er décembre 2026 » : dans le bandeau
export function dateLongue(date: Date): string {
  return formater(LONG, date);
}
