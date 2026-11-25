import type { PisteDemo } from '../mocks/pistes.ts';

// Les lignes du panier : une par piste choisie, avec sa photo, ses formats et
// son nombre d'échantillons. Partagées par le panier de l'écran 07 · Pistes
// et le récapitulatif de l'écran 09 · Livraison

// Les formats d'échantillon, dans l'ordre de la maquette : la commande les
// garde dans l'ordre des clics, on les affiche toujours dans celui-ci
export const FORMATS_ECHANTILLON = [
  'Mouillettes parfumées',
  'Flacon 5 ml',
  'Dans vos produits',
] as const;

export type FormatEchantillon = (typeof FORMATS_ECHANTILLON)[number];

// Les libellés courts, pour une carte étroite (le récapitulatif de l'écran
// 09) : la ligne des formats y tient sur une ligne
const LIBELLES_COURTS: Record<FormatEchantillon, string> = {
  'Mouillettes parfumées': 'Mouillettes',
  'Flacon 5 ml': 'Flacon 5 ml',
  'Dans vos produits': 'Dans vos produits',
};

// Les formats choisis, dans l'ordre de FORMATS_ECHANTILLON
export function formatsChoisis(formats: string[]): FormatEchantillon[] {
  return FORMATS_ECHANTILLON.filter((f) => formats.includes(f));
}

type Props = {
  // Les pistes choisies, dans l'ordre d'affichage
  pistes: PisteDemo[];
  // Quantité par piste (identifiant de piste → quantité)
  quantites: Record<string, number>;
  formats: string[];
  // long (par défaut) : « mouillettes parfumées, dans vos produits », comme
  // le panier de l'écran 07 ; court : « Mouillettes, dans vos produits »
  libelle?: 'long' | 'court';
};

// La ligne des formats : tout en minuscules, avec une majuscule initiale
// pour les libellés courts, comme dans la maquette de l'écran 09
function texteFormats(
  formats: FormatEchantillon[],
  libelle: 'long' | 'court',
): string {
  if (libelle === 'long') return formats.join(', ').toLowerCase();
  const texte = formats
    .map((f) => LIBELLES_COURTS[f])
    .join(', ')
    .toLowerCase();
  return texte.charAt(0).toUpperCase() + texte.slice(1);
}

export function LignesPanier({
  pistes,
  quantites,
  formats,
  libelle = 'long',
}: Props) {
  const choisis = formatsChoisis(formats);
  const formatsTexte = texteFormats(choisis, libelle);
  return (
    <ul className="panier-lignes">
      {pistes.map((p) => (
        <li key={p.id}>
          <img src={p.photo} alt="" />
          <span className="panier-ligne-texte">
            <strong>
              Piste {p.lettre}, {p.nom}
            </strong>
            <span>{formatsTexte || 'aucun format choisi'}</span>
          </span>
          {/* Un échantillon par format et par unité, comme
              nombreEchantillons */}
          <span className="panier-quantite">
            × {(quantites[p.id] ?? 0) * choisis.length}
          </span>
        </li>
      ))}
    </ul>
  );
}
