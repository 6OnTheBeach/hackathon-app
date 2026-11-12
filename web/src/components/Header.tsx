import avatar from '../assets/avatar.jpg';
import logo from '../assets/logo-givaudan.png';
import panier from '../assets/panier.svg';

// L'en-tête commun à tous les écrans (composant « Header » de la maquette).
// panier : le nombre d'échantillons au panier, affiché sur l'icône
export function Header({ panier: nombre = 0 }: { panier?: number }) {
  return (
    <header className="entete">
      <img className="logo" src={logo} alt="Givaudan" />
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
