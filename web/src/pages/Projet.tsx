import type { Analysis } from '../api.ts';
import bougie from '../assets/produit-bougie.png';
import hygiene from '../assets/produit-hygiene.png';
import interieur from '../assets/produit-interieur.png';
import lessive from '../assets/produit-lessive.png';
import parfum from '../assets/produit-parfum.png';
import soin from '../assets/produit-soin.png';
import { Etapes } from '../components/Etapes.tsx';

// Écran « 04 · Votre projet » de la maquette Figma : les questions sur le
// projet à gauche, le brief qui se remplit au fil des réponses à droite

// fond : la couleur de la vignette le temps que la photo se charge
const PRODUITS = [
  { nom: 'Parfum', src: parfum, fond: '#e9e4dc' },
  { nom: 'Soin du corps', src: soin, fond: '#e8e2d6' },
  { nom: 'Bougie', src: bougie, fond: '#d9d2c8' },
  { nom: 'Lessive, linge', src: lessive, fond: '#dde6ee' },
  { nom: 'Parfum d’intérieur', src: interieur, fond: '#5a5a3e' },
  { nom: 'Hygiène, douche', src: hygiene, fond: '#1f4a50' },
];

const MARCHES = [
  'Europe',
  'Amérique du Nord',
  'Amérique latine',
  'Asie-Pacifique',
  'Moyen-Orient',
  'Afrique',
];

export type ProjetReponses = { produits: string[]; marches: string[] };

type Props = {
  analysis: Analysis;
  reponses: ProjetReponses;
  onReponsesChange: (reponses: ProjetReponses) => void;
  // La photo du brief : la même que celle de l'écran Ressentir (la première
  // image choisie à l'étape Explorer) ; sans image, un dégradé neutre
  image?: string;
  onRetour: () => void;
  onSuivant: () => void;
};

// Ajoute ou retire une valeur, en gardant l'ordre de la liste de référence
function basculer(liste: string[], valeur: string, ordre: string[]) {
  const suivante = liste.includes(valeur)
    ? liste.filter((v) => v !== valeur)
    : [...liste, valeur];
  return ordre.filter((v) => suivante.includes(v));
}

export function Projet({
  analysis,
  reponses,
  onReponsesChange,
  image,
  onRetour,
  onSuivant,
}: Props) {
  const { produits, marches } = reponses;
  const ordreProduits = PRODUITS.map((p) => p.nom);

  return (
    <div className="projet">
      <div className="projet-contenu">
        <div className="projet-questions">
          <Etapes courante={3} />
          <div className="titre">
            <h1>Parlez-nous de votre projet</h1>
            <p>
              Deux questions rapides pour que nos parfumeurs imaginent une
              fragrance qui fonctionne dans vos produits.
            </p>
          </div>

          <fieldset className="question-carte">
            <legend>
              <span className="question-numero">1</span>
              Dans quels produits l’imaginez-vous&nbsp;?
            </legend>
            <div className="produits">
              {PRODUITS.map((p) => {
                const coche = produits.includes(p.nom);
                return (
                  <label
                    key={p.nom}
                    className={coche ? 'produit coche' : 'produit'}
                  >
                    <img
                      src={p.src}
                      alt=""
                      style={{ backgroundColor: p.fond }}
                    />
                    <span className="produit-nom">{p.nom}</span>
                    <input
                      type="checkbox"
                      checked={coche}
                      onChange={() =>
                        onReponsesChange({
                          ...reponses,
                          produits: basculer(produits, p.nom, ordreProduits),
                        })
                      }
                    />
                    <span className="case" aria-hidden="true">
                      {coche ? '✓' : ''}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="question-carte">
            <legend>
              <span className="question-numero">2</span>
              Où sera-t-elle commercialisée&nbsp;?
            </legend>
            <div className="marches">
              {MARCHES.map((m) => (
                <button
                  key={m}
                  type="button"
                  className={marches.includes(m) ? 'marche choisi' : 'marche'}
                  aria-pressed={marches.includes(m)}
                  onClick={() =>
                    onReponsesChange({
                      ...reponses,
                      marches: basculer(marches, m, MARCHES),
                    })
                  }
                >
                  {m}
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <Brief analysis={analysis} reponses={reponses} image={image} />
      </div>

      <div className="barre">
        <button type="button" className="bouton secondaire" onClick={onRetour}>
          ← Retour
        </button>
        <button type="button" className="bouton" onClick={onSuivant}>
          Suivant →
        </button>
      </div>
    </div>
  );
}

// Le panneau « Votre brief en direct »
function Brief({
  analysis,
  reponses,
  image,
}: {
  analysis: Analysis;
  reponses: ProjetReponses;
  image?: string;
}) {
  const { produits, marches } = reponses;
  // La signature compte pour moitié, chaque question pour un quart
  const avancement =
    50 + (produits.length > 0 ? 25 : 0) + (marches.length > 0 ? 25 : 0);
  const univers = [...analysis.roue]
    .sort((a, b) => b.pourcentage - a.pourcentage)
    .map((f) => f.famille)
    .join(', ');

  return (
    <aside className="brief" aria-live="polite">
      <div
        className="brief-photo"
        style={image ? { backgroundImage: `url(${image})` } : undefined}
      >
        <span>Votre brief</span>
        <strong>{analysis.signature.nom}</strong>
      </div>
      <div className="brief-corps">
        <div className="brief-avancement">
          <Anneau valeur={avancement} />
          <p>
            {avancement} % ·{' '}
            {avancement < 100
              ? 'Votre brief est presque prêt. Quelques mots sur votre projet aideront nos parfumeurs.'
              : 'Votre brief est prêt pour nos parfumeurs.'}
          </p>
        </div>
        <dl className="brief-lignes">
          <div>
            <dt>Univers</dt>
            <dd>{univers || '—'}</dd>
          </div>
          <div>
            <dt>Produits</dt>
            <dd>{produits.join(', ') || '—'}</dd>
          </div>
          <div>
            <dt>Marchés</dt>
            <dd>{marches.join(', ') || '—'}</dd>
          </div>
        </dl>
      </div>
    </aside>
  );
}

// L'anneau d'avancement : 64 px, trait de 6, comme dans la maquette
function Anneau({ valeur }: { valeur: number }) {
  const rayon = 27;
  const tour = 2 * Math.PI * rayon;
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" aria-hidden="true">
      <circle
        cx={32}
        cy={32}
        r={rayon}
        fill="none"
        stroke="#e6e8e8"
        strokeWidth={6}
      />
      <circle
        cx={32}
        cy={32}
        r={rayon}
        fill="none"
        stroke="#346e4a"
        strokeWidth={6}
        strokeDasharray={`${(tour * valeur) / 100} ${tour}`}
        transform="rotate(-90 32 32)"
      />
    </svg>
  );
}
