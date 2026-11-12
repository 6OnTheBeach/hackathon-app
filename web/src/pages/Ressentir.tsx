import type { Analysis, ProfilNote } from '../api.ts';
import pointPret from '../assets/point-pret.svg';
import { Etapes } from '../components/Etapes.tsx';

// Écran « 03 · Ressentir — signature olfactive » de la maquette Figma,
// resserré pour tenir sans défiler : le bandeau de la signature, puis la roue
// des familles et leur détail côte à côte

// Les couleurs des familles, dans l'ordre de la roue (les 3 premières sont
// celles de la maquette)
const COULEURS = [
  '#3b6c8f',
  '#78608d',
  '#9a6633',
  '#6e7f3a',
  '#b5546a',
  '#4e8a7a',
  '#8a4f6b',
  '#5d6b66',
];

type Props = {
  analysis: Analysis;
  // La première image choisie à l'étape Explorer : elle « donne la direction ».
  // Sans image, un dégradé neutre (aucune photo sans rapport avec le souvenir)
  image?: string;
  onRetour: () => void;
  onSuivant: () => void;
};

export function Ressentir({ analysis, image, onRetour, onSuivant }: Props) {
  const { signature } = analysis;

  return (
    <div className="ressentir">
      {/* La zone qui défile : la barre reste visible en dessous */}
      <div className="defilement">
        <section
          className="signature-bandeau"
          style={image ? { backgroundImage: `url(${image})` } : undefined}
        >
          <Etapes courante={2} claire />
          <div className="signature-texte">
            <span className="signature-badge">
              <img src={pointPret} alt="" width={8} height={8} />
              Votre signature olfactive est prête
            </span>
            <h1>{signature.nom}</h1>
            <p>{signature.description}</p>
          </div>
        </section>

        <section className="roue-section" aria-labelledby="roue-titre">
          <Roue roue={analysis.roue} photo={image} />
          <div className="familles">
            <div className="familles-titre">
              <h2 id="roue-titre">Votre roue olfactive</h2>
              <p>Les familles olfactives qui traduisent votre souvenir.</p>
            </div>
            <Familles roue={analysis.roue} />
          </div>
          {analysis.profil && <Pyramide profil={analysis.profil} />}
        </section>
      </div>

      <div className="barre barre-flottante">
        <button type="button" className="bouton discret" onClick={onRetour}>
          ← Retour
        </button>
        <button type="button" className="bouton" onClick={onSuivant}>
          Suivant →
        </button>
      </div>
    </div>
  );
}

type Part = { famille: string; part: number; couleur: string };

// Les familles avec leur part de la roue (0 à 1), plus grande en premier
function parts(roue: Analysis['roue']): Part[] {
  const total = roue.reduce((s, f) => s + Math.max(0, f.pourcentage), 0);
  return [...roue]
    .filter((f) => f.pourcentage > 0)
    .sort((a, b) => b.pourcentage - a.pourcentage)
    .map((f, i) => ({
      famille: f.famille,
      part: total > 0 ? f.pourcentage / total : 0,
      couleur: COULEURS[i % COULEURS.length] ?? '#5d6b66',
    }));
}

// Repère de la roue : 600 × 600, centre (300, 300), départ en haut, sens horaire
const CENTRE = 300;
const R_EXT = 225;
const R_INT = 135;

function point(rayon: number, angle: number): string {
  const a = (angle - 90) * (Math.PI / 180);
  return `${CENTRE + rayon * Math.cos(a)} ${CENTRE + rayon * Math.sin(a)}`;
}

// Un arc de couronne entre deux angles, en degrés
function arc(debut: number, fin: number): string {
  // Une seule famille : un tour complet ne se dessine pas d'un seul arc
  const f = Math.min(fin, debut + 359.99);
  const grand = f - debut > 180 ? 1 : 0;
  return [
    `M ${point(R_EXT, debut)}`,
    `A ${R_EXT} ${R_EXT} 0 ${grand} 1 ${point(R_EXT, f)}`,
    `L ${point(R_INT, f)}`,
    `A ${R_INT} ${R_INT} 0 ${grand} 0 ${point(R_INT, debut)}`,
    'Z',
  ].join(' ');
}

function Roue({ roue, photo }: { roue: Analysis['roue']; photo?: string }) {
  const familles = parts(roue);
  let angle = 0;
  const segments = familles.map((f) => {
    const debut = angle;
    angle += f.part * 360;
    return { ...f, debut, fin: angle };
  });

  return (
    <div className="roue">
      <svg
        viewBox="0 0 600 600"
        role="img"
        aria-label={familles
          .map((f) => `${f.famille} ${Math.round(f.part * 100)} %`)
          .join(', ')}
      >
        <circle
          cx={CENTRE}
          cy={CENTRE}
          r={290}
          fill="none"
          stroke="#e1e4e4"
          strokeWidth={1.5}
          strokeDasharray="3 7"
        />
        {segments.map((s) => (
          <path
            key={s.famille}
            d={arc(s.debut, s.fin)}
            fill={s.couleur}
            stroke="#fff"
            strokeWidth={4}
          />
        ))}
        {segments
          .filter((s) => s.part >= 0.06)
          .map((s) => {
            const [x, y] = point((R_EXT + R_INT) / 2, (s.debut + s.fin) / 2)
              .split(' ')
              .map(Number);
            return (
              <text
                key={s.famille}
                x={x}
                y={y}
                className="roue-pourcentage"
                textAnchor="middle"
                dominantBaseline="central"
              >
                {Math.round(s.part * 100)} %
              </text>
            );
          })}
      </svg>
      {photo ? (
        <img className="roue-photo" src={photo} alt="" />
      ) : (
        <span className="roue-photo neutre" aria-hidden="true" />
      )}
    </div>
  );
}

function Familles({ roue }: { roue: Analysis['roue'] }) {
  const familles = parts(roue);
  const max = familles[0]?.part ?? 1;
  return (
    <ul className="familles-liste">
      {familles.map((f) => (
        <li key={f.famille}>
          <span className="famille-pourcentage">
            {Math.round(f.part * 100)}
            <small>%</small>
          </span>
          <span className="famille-detail">
            <span className="famille-nom">{f.famille}</span>
            <span className="famille-barre">
              <span
                style={{
                  width: `${(f.part / max) * 100}%`,
                  background: f.couleur,
                }}
              />
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}

const NIVEAUX = [
  { cle: 'tete', nom: 'Tête' },
  { cle: 'coeur', nom: 'Cœur' },
  { cle: 'fond', nom: 'Fond' },
] as const;

// La pyramide olfactive de l'analyse (profil.tete, profil.coeur, profil.fond) :
// pour chaque note, l'ingrédient, sa référence catalogue et la raison de l'IA
function Pyramide({ profil }: { profil: NonNullable<Analysis['profil']> }) {
  return (
    <section className="pyramide" aria-labelledby="pyramide-titre">
      <h2 id="pyramide-titre">Votre pyramide olfactive</h2>
      <dl className="pyramide-niveaux">
        {NIVEAUX.map(({ cle, nom }) => {
          const notes: ProfilNote[] = profil[cle];
          if (notes.length === 0) return null;
          return (
            <div key={cle} className="pyramide-niveau">
              <dt>{nom}</dt>
              {notes.map((n) => (
                <dd key={`${n.reference}-${n.ingredient}`}>
                  <span className="pyramide-ingredient">
                    <strong>{n.ingredient}</strong>
                    <span className="pyramide-reference">
                      Réf. {n.reference}
                    </span>
                  </span>
                  <span className="pyramide-raison">{n.raison}</span>
                </dd>
              ))}
            </div>
          );
        })}
      </dl>
    </section>
  );
}
