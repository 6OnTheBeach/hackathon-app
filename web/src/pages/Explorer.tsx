import agrumes from '../assets/explorer-agrumes.png';
import boisFlotte from '../assets/explorer-bois-flotte.png';
import epices from '../assets/explorer-epices.png';
import feuillage from '../assets/explorer-feuillage.png';
import fleursBlanches from '../assets/explorer-fleurs-blanches.png';
import foretBrume from '../assets/explorer-foret-brume.png';
import frangipanier from '../assets/explorer-frangipanier.png';
import sousLeau from '../assets/explorer-sous-l-eau.png';
import { Etapes } from '../components/Etapes.tsx';

// Écran « 02 · Explorer — images » de la maquette Figma

// fond : la couleur de la carte le temps que la photo se charge
export const IMAGES = [
  {
    id: 'feuillage',
    nom: 'Feuillage mouillé',
    src: feuillage,
    fond: '#4e6b4f',
  },
  {
    id: 'frangipanier',
    nom: 'Frangipanier',
    src: frangipanier,
    fond: '#3e5640',
  },
  {
    id: 'fleurs-blanches',
    nom: 'Fleurs blanches',
    src: fleursBlanches,
    fond: '#e9e4dc',
  },
  { id: 'bois-flotte', nom: 'Bois flotté', src: boisFlotte, fond: '#c9ae8c' },
  {
    id: 'foret-brume',
    nom: 'Forêt dans la brume',
    src: foretBrume,
    fond: '#5d6b66',
  },
  { id: 'sous-l-eau', nom: "Sous l'eau", src: sousLeau, fond: '#1f4a50' },
  { id: 'agrumes', nom: 'Agrumes', src: agrumes, fond: '#e0a43a' },
  { id: 'epices', nom: 'Épices', src: epices, fond: '#9a5a32' },
];

type Props = {
  // Les identifiants des images choisies, dans l'ordre du choix
  selection: string[];
  onSelectionChange: (selection: string[]) => void;
  onRetour: () => void;
  onSuivant: () => void;
};

export function Explorer({
  selection,
  onSelectionChange,
  onRetour,
  onSuivant,
}: Props) {
  function basculer(id: string) {
    onSelectionChange(
      selection.includes(id)
        ? selection.filter((s) => s !== id)
        : [...selection, id],
    );
  }

  return (
    <div className="explorer">
      <div className="question">
        <Etapes courante={1} />
        <div className="question-titre">
          <h1>Quelles images vous ramènent là-bas ?</h1>
          <p>
            Sélectionnez-en autant que vous voulez. La première donne la
            direction.
          </p>
        </div>
      </div>

      <ul className="images" aria-label="Choix d'images">
        {IMAGES.map((image) => {
          const rang = selection.indexOf(image.id);
          const choisie = rang !== -1;
          return (
            <li key={image.id}>
              <button
                type="button"
                className={choisie ? 'image-carte choisie' : 'image-carte'}
                style={{ backgroundColor: image.fond }}
                aria-pressed={choisie}
                onClick={() => basculer(image.id)}
              >
                <img src={image.src} alt="" loading="lazy" />
                <span className="image-bas">
                  <span className="image-nom">{image.nom}</span>
                  <span className="image-rang" aria-hidden="true">
                    {choisie ? rang + 1 : '+'}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

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
