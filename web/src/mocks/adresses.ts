// Données de démonstration : les adresses de livraison proposées sur l'écran
// 09 · Livraison. Aucune route de l'API ne les fournit, et le compte saisi à
// l'écran 08 n'en a pas : elles sont fictives, seule la société vient de la
// saisie

export type IdAdresse = 'siege' | 'laboratoire';

export type AdresseDemo = {
  id: IdAdresse;
  rue: string;
  codePostal: string;
  ville: string;
};

// Dans l'ordre d'affichage : le siège, puis le laboratoire
export const ADRESSES: Record<IdAdresse, AdresseDemo> = {
  siege: {
    id: 'siege',
    rue: '8 rue des Parfumeurs',
    codePostal: '75008',
    ville: 'Paris',
  },
  laboratoire: {
    id: 'laboratoire',
    rue: '14 chemin des Senteurs',
    codePostal: '06130',
    ville: 'Grasse',
  },
};

// Le libellé d'une adresse : le siège porte le nom de la société saisie
export function libelleAdresse(adresse: AdresseDemo, societe: string): string {
  return adresse.id === 'siege' ? `Siège, ${societe}` : 'Laboratoire R&D';
}

// La rue, puis le code postal et la ville
export function ligneAdresse(adresse: AdresseDemo): string {
  return `${adresse.rue}, ${adresse.codePostal} ${adresse.ville}`;
}
