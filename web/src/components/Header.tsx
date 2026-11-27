import avatar from '../assets/avatar.jpg';
import logo from '../assets/logo-givaudan.png';
import panier from '../assets/panier.svg';

// L'en-tête commun à tous les écrans (composant « Header » de la maquette).
// panier : le nombre d'échantillons au panier, affiché sur l'icône.
// onAccueil : le logo ramène à l'accueil.
// claire : la variante de l'accueil, transparente et en blanc, posée sur la
// photo du bandeau
export function Header({
  panier: nombre = 0,
  onAccueil,
  claire = false,
}: {
  panier?: number;
  onAccueil: () => void;
  claire?: boolean;
}) {
  return (
    <header className={claire ? 'entete claire' : 'entete'}>
      <button
        type="button"
        className="logo-bouton"
        aria-label="Givaudan, retour à l'accueil"
        onClick={onAccueil}
      >
        <img className="logo" src={logo} alt="" />
      </button>
      <nav className="menu" aria-label="Givaudan">
        <span>Our Company</span>
        <span>Taste &amp; Wellbeing</span>
        <span>Fragrance &amp; Beauty</span>
      </nav>
      <div className="compte">
        <span className="panier-icone">
          <img
            src={panier}
            alt={
              nombre > 0
                ? `Panier\u00A0: ${nombre} échantillons`
                : 'Panier vide'
            }
            width={24}
            height={31}
          />
          {nombre > 0 && (
            <span className="panier-badge" aria-hidden="true">
              {nombre}
            </span>
          )}
        </span>
        <img className="avatar" src={avatar} alt="Mon compte" />
      </div>
    </header>
  );
}
