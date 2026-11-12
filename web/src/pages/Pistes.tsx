import boisFlotte from '../assets/explorer-bois-flotte.png';
import fleursBlanches from '../assets/explorer-fleurs-blanches.png';
import frangipanier from '../assets/explorer-frangipanier.png';
import pluie from '../assets/brief-pluie.png';
import mouillettes from '../assets/format-mouillettes.png';
import interieur from '../assets/produit-interieur.png';

// Écran « 07 · Vos pistes et panier » de la maquette Figma : les pistes
// imaginées par les parfumeurs, la forme des échantillons, et le panier

// Données de démonstration, reprises de la maquette : aucune route de l'API
// ne fournit encore les pistes des parfumeurs
const PISTES = [
  {
    id: 'A',
    nom: 'Pluie de jade',
    citation:
      'Une ouverture très aérienne, au plus près de l’air juste après l’averse.',
    composition: { vert: 55, floral: 25, bois: 20 },
    matieres: 'Accord pluie, thé vert, jasmin',
    photo: pluie,
  },
  {
    id: 'B',
    nom: 'Pétales mouillés',
    citation:
      'Les fleurs blanches au premier plan, portées par une fraîcheur humide.',
    composition: { vert: 35, floral: 45, bois: 20 },
    matieres: 'Frangipanier, feuille verte, muscs blancs',
    photo: frangipanier,
  },
  {
    id: 'C',
    nom: 'Teck tiède',
    citation:
      'Un sillage plus enveloppant : le souvenir de la terrasse en bois.',
    composition: { vert: 30, floral: 25, bois: 45 },
    matieres: 'Bois flotté, mousse, accord pluie',
    photo: boisFlotte,
  },
];

const FAMILLES = [
  { cle: 'vert', nom: 'Vert', couleur: '#3b6c8f' },
  { cle: 'floral', nom: 'floral', couleur: '#78608d' },
  { cle: 'bois', nom: 'bois', couleur: '#9a6633' },
] as const;

const FORMATS = [
  {
    nom: 'Mouillettes parfumées',
    description: 'Des touches papier, pour sentir tout de suite.',
    photo: mouillettes,
  },
  {
    nom: 'Flacon 5 ml',
    description: 'L’huile parfumée, pour tester à votre rythme.',
    photo: fleursBlanches,
  },
  {
    nom: 'Dans vos produits',
    description: 'Intégrée à une base soin et une bougie test.',
    photo: interieur,
  },
];

const QUANTITE_MAX = 5;

export type Commande = {
  // Quantité par piste choisie (identifiant de piste → quantité)
  pistes: Record<string, number>;
  formats: string[];
};

// Un échantillon par piste, par format et par unité
export function nombreEchantillons(commande: Commande): number {
  const unites = Object.values(commande.pistes).reduce((s, q) => s + q, 0);
  return unites * commande.formats.length;
}

type Props = {
  signature: string;
  commande: Commande;
  onCommandeChange: (commande: Commande) => void;
  // Le nombre d'échantillons déjà mis au panier (null : rien d'ajouté)
  auPanier: number | null;
  onAjouter: () => void;
  onRetour: () => void;
};

export function Pistes({
  signature,
  commande,
  onCommandeChange,
  auPanier,
  onAjouter,
  onRetour,
}: Props) {
  const choisies = PISTES.filter((p) => p.id in commande.pistes);
  const echantillons = nombreEchantillons(commande);
  const formats = FORMATS.map((f) => f.nom).filter((f) =>
    commande.formats.includes(f),
  );
  const formatsTexte = formats.join(', ').toLowerCase();
  const dejaAjoute = auPanier !== null && auPanier === echantillons;

  function basculerPiste(id: string) {
    const pistes = { ...commande.pistes };
    if (id in pistes) delete pistes[id];
    else pistes[id] = 1;
    onCommandeChange({ ...commande, pistes });
  }

  function changerQuantite(id: string, quantite: number) {
    onCommandeChange({
      ...commande,
      pistes: { ...commande.pistes, [id]: quantite },
    });
  }

  function basculerFormat(nom: string) {
    const suivants = commande.formats.includes(nom)
      ? commande.formats.filter((f) => f !== nom)
      : [...commande.formats, nom];
    onCommandeChange({ ...commande, formats: suivants });
  }

  return (
    <div className="pistes-page">
      <div className="pistes-contenu">
        <div className="pistes-gauche">
          <div className="pistes-titre">
            <span className="pistes-nouveau">
              <span aria-hidden="true" />
              Nouveau : {PISTES.length} pistes disponibles
            </span>
            <h1>Nos parfumeurs ont imaginé trois pistes</h1>
            <p>
              Toutes partent de votre souvenir « {signature} ». Choisissez
              celles que vous voulez sentir : elles s’ajoutent à votre panier, à
              droite.
            </p>
          </div>

          <ul className="pistes" aria-label="Pistes">
            {PISTES.map((piste) => {
              const choisie = piste.id in commande.pistes;
              const quantite = commande.pistes[piste.id] ?? 1;
              return (
                <li
                  key={piste.id}
                  className={choisie ? 'piste choisie' : 'piste'}
                >
                  <div
                    className="piste-photo"
                    style={{ backgroundImage: `url(${piste.photo})` }}
                  >
                    <span className="piste-lettre">Piste {piste.id}</span>
                    <button
                      type="button"
                      className="piste-choix"
                      aria-pressed={choisie}
                      aria-label={`Choisir la piste ${piste.id}, ${piste.nom}`}
                      onClick={() => basculerPiste(piste.id)}
                    >
                      {choisie ? '✓' : '+'}
                    </button>
                  </div>
                  <div className="piste-corps">
                    <h2>{piste.nom}</h2>
                    <p className="piste-citation">« {piste.citation} »</p>
                    <div className="piste-composition">
                      <span className="piste-barre" aria-hidden="true">
                        {FAMILLES.map((f) => (
                          <span
                            key={f.cle}
                            style={{
                              width: `${piste.composition[f.cle]}%`,
                              background: f.couleur,
                            }}
                          />
                        ))}
                      </span>
                      <span>
                        {FAMILLES.map(
                          (f) => `${f.nom} ${piste.composition[f.cle]} %`,
                        ).join(', ')}
                      </span>
                    </div>
                    <p className="piste-matieres">{piste.matieres}</p>
                    <div className="piste-quantite">
                      <span>Quantité</span>
                      <span className="compteur">
                        <button
                          type="button"
                          aria-label={`Une de moins, piste ${piste.id}`}
                          disabled={!choisie || quantite <= 1}
                          onClick={() =>
                            changerQuantite(piste.id, quantite - 1)
                          }
                        >
                          −
                        </button>
                        <output aria-live="polite">{quantite}</output>
                        <button
                          type="button"
                          aria-label={`Une de plus, piste ${piste.id}`}
                          disabled={!choisie || quantite >= QUANTITE_MAX}
                          onClick={() =>
                            changerQuantite(piste.id, quantite + 1)
                          }
                        >
                          +
                        </button>
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <fieldset className="formats">
            <legend>Sous quelle forme voulez-vous les sentir ?</legend>
            <div className="formats-liste">
              {FORMATS.map((f) => {
                const coche = commande.formats.includes(f.nom);
                return (
                  <label
                    key={f.nom}
                    className={coche ? 'format coche' : 'format'}
                  >
                    <img src={f.photo} alt="" />
                    <span className="format-texte">
                      <strong>{f.nom}</strong>
                      <span>{f.description}</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={coche}
                      onChange={() => basculerFormat(f.nom)}
                    />
                    <span className="case" aria-hidden="true">
                      {coche ? '✓' : ''}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        </div>

        <aside className="panier" aria-live="polite">
          <div className="panier-haut">
            <h2>Votre panier</h2>
            <span>
              {echantillons} échantillon{echantillons > 1 ? 's' : ''}
            </span>
          </div>

          {choisies.length === 0 ? (
            <p className="panier-vide">Choisissez une piste pour la sentir.</p>
          ) : (
            <ul className="panier-lignes">
              {choisies.map((p) => (
                <li key={p.id}>
                  <img src={p.photo} alt="" />
                  <span className="panier-ligne-texte">
                    <strong>
                      Piste {p.id}, {p.nom}
                    </strong>
                    <span>{formatsTexte || 'aucun format choisi'}</span>
                  </span>
                  <span className="panier-quantite">
                    × {(commande.pistes[p.id] ?? 0) * formats.length}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <dl className="panier-infos">
            <div>
              <dt>Formats</dt>
              <dd>{formatsTexte || '—'}</dd>
            </div>
            <div>
              <dt>Livraison estimée</dt>
              <dd>5 jours ouvrés</dd>
            </div>
            <div>
              <dt>Conditions</dt>
              <dd>Selon votre accord Givaudan</dd>
            </div>
          </dl>

          <button
            type="button"
            className="bouton panier-ajouter"
            disabled={echantillons === 0 || dejaAjoute}
            onClick={onAjouter}
          >
            {dejaAjoute ? 'Ajouté au panier ✓' : 'Ajouter au panier'}
          </button>
          <p className="panier-note">
            Vous créerez votre compte à l’étape suivante pour suivre la
            livraison.
          </p>
        </aside>
      </div>

      <div className="barre">
        <button type="button" className="bouton secondaire" onClick={onRetour}>
          ← Retour
        </button>
      </div>
    </div>
  );
}
