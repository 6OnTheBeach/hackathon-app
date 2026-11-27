import foretPluie from '../assets/accueil-foret-pluie.png';
import foretSapins from '../assets/accueil-foret-sapins.png';
import jardin from '../assets/accueil-jardin.png';
import mainMousse from '../assets/accueil-main-mousse.png';
import foret from '../assets/compte-foret.png';
import boisFlotte from '../assets/explorer-bois-flotte.png';
import feuillage from '../assets/explorer-feuillage.png';
import mouillettes from '../assets/format-mouillettes.png';
import bougie from '../assets/produit-bougie.png';
import { Header } from '../components/Header.tsx';

// Écran « 00 · Accueil » de la maquette Figma : présente Scent Journey et
// lance le parcours. Rien n'est enregistré, aucun appel à l'API.
// onCommencer : les trois boutons « Commencer l'expérience » mènent au
// dernier écran visité du parcours (Raconter s'il n'a pas commencé)

type Props = {
  panier: number;
  onAccueil: () => void;
  onCommencer: () => void;
};

// La barre du bandeau : décorative, sans bouton ni lien
const ETAPES = [
  { image: boisFlotte, titre: '1. Racontez', detail: 'écrit, voix ou photo' },
  {
    image: mouillettes,
    titre: '2. Explorez',
    detail: 'images, lumière, matière',
  },
  { image: foretPluie, titre: '3. Ressentez', detail: 'votre signature' },
  { image: feuillage, titre: '4. Précisez', detail: 'votre projet' },
  { image: jardin, titre: '5. Envoyez', detail: 'votre demande' },
];

// duree : le badge affiché ; dureeLue : sa version pour les lecteurs d'écran
const CARTES = [
  {
    image: jardin,
    duree: '2 min',
    dureeLue: '2 minutes',
    titre: 'Racontez votre souvenir',
    texte:
      "Écrivez, dictez ou importez une photo. L'IA repère en direct les lieux, moments, sensations et émotions.",
    resultat: 'Vous obtenez une première lecture sensorielle.',
  },
  {
    image: feuillage,
    duree: '3 min',
    dureeLue: '3 minutes',
    titre: 'Explorez votre univers',
    texte:
      'Choisissez des images, puis nuancez la lumière, la matière, l’émotion et la présence.',
    resultat: 'Vous obtenez un univers visuel précis.',
  },
  {
    image: mainMousse,
    duree: '1 min',
    dureeLue: '1 minute',
    titre: 'Ressentez votre signature',
    texte:
      'Découvrez votre roue olfactive et la façon dont la fragrance se révèle selon le produit.',
    resultat: 'Vous obtenez votre signature olfactive.',
  },
  {
    image: bougie,
    duree: '2 min',
    dureeLue: '2 minutes',
    titre: 'Précisez votre projet',
    texte:
      'Produits, marchés, lancement et engagements\u00A0: quatre questions simples.',
    resultat: 'Vous obtenez un brief complet à 100\u00A0%.',
  },
  {
    image: boisFlotte,
    duree: '1 min',
    dureeLue: '1 minute',
    titre: 'Envoyez votre demande',
    texte:
      'Relisez votre demande et envoyez-la à nos experts\u00A0: nos parfumeurs imaginent trois pistes pour vous.',
    resultat: 'Vous obtenez trois pistes à sentir.',
  },
  {
    image: foret,
    duree: '3 semaines',
    dureeLue: '3 semaines',
    titre: 'Sentez, puis recevez votre brief',
    texte:
      'Commandez vos échantillons, suivez la livraison dans votre compte et donnez votre avis\u00A0: nos parfumeurs établissent votre brief final.',
    resultat: 'Vous obtenez votre brief olfactif en PDF.',
  },
];

export function Accueil({ panier, onAccueil, onCommencer }: Props) {
  return (
    <div className="accueil">
      {/* Le bandeau principal : la photo assombrie, l'en-tête en blanc
          posé dessus, puis le texte et la barre des étapes */}
      <section className="accueil-bandeau">
        <img className="accueil-photo" src={mainMousse} alt="" />
        <Header claire panier={panier} onAccueil={onAccueil} />

        <div className="accueil-bandeau-texte">
          <span className="accueil-badge">
            <span className="accueil-point" aria-hidden="true" />
            Scent Journey, l'expérience de création guidée
          </span>
          <h1>Et si votre souvenir devenait une fragrance&nbsp;?</h1>
          <p className="accueil-chapo">
            Racontez un moment vécu. Notre IA le traduit en univers sensoriel,
            puis en brief olfactif prêt pour nos parfumeurs. Sans jargon, en
            huit minutes.
          </p>
          <button
            type="button"
            className="accueil-bouton"
            onClick={onCommencer}
          >
            Commencer l'expérience
          </button>
        </div>

        <ul className="accueil-etapes">
          {ETAPES.map((etape, i) => (
            <li key={etape.titre} className={i === 0 ? 'actif' : undefined}>
              <img src={etape.image} alt="" />
              <span>
                <strong>{etape.titre}</strong>
                {etape.detail}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="accueil-brief" aria-labelledby="accueil-brief-titre">
        <div className="accueil-brief-haut">
          <h2 id="accueil-brief-titre">Comment se construit votre brief</h2>
          <p>
            Six étapes, dont cinq avec vous. Vous envoyez votre demande, sentez
            trois pistes, puis recevez votre brief olfactif final, établi à
            partir de vos retours.
          </p>
        </div>

        <ol className="accueil-cartes">
          {CARTES.map((carte, i) => (
            <li key={carte.titre} className="accueil-carte">
              <div className="accueil-carte-visuel">
                <img src={carte.image} alt="" />
                <span className="accueil-duree">
                  <span aria-hidden="true">{carte.duree}</span>
                  <span className="sr-only">Durée&nbsp;: {carte.dureeLue}</span>
                </span>
              </div>
              <h3>
                <span className="accueil-numero" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {carte.titre}
              </h3>
              <p>{carte.texte}</p>
              <p className="accueil-resultat">{carte.resultat}</p>
            </li>
          ))}
        </ol>

        <button type="button" className="bouton" onClick={onCommencer}>
          Commencer l'expérience
        </button>
      </section>

      <section className="accueil-final" aria-labelledby="accueil-final-titre">
        <img className="accueil-photo" src={foretSapins} alt="" />
        <div className="accueil-final-texte">
          <h2 id="accueil-final-titre">Human by nature. Créé avec vous.</h2>
          <p>
            Creating for happier, healthier lives with love for nature. Votre
            fragrance commence par ce que vous avez vécu.
          </p>
          <button
            type="button"
            className="accueil-bouton"
            onClick={onCommencer}
          >
            Commencer l'expérience
          </button>
        </div>
      </section>

      <footer className="accueil-pied">
        <strong>Givaudan</strong>
        <span>Scent Journey — concept d'expérience Fragrance &amp; Beauty</span>
      </footer>
    </div>
  );
}
