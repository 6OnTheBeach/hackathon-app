import coton from '../assets/confirmation-coton.png';
import iconePersonne from '../assets/icone-personne.svg';
import iconeTelephone from '../assets/icone-telephone.svg';
import { LignesPanier } from '../components/LignesPanier.tsx';
import { pistesPour } from '../mocks/pistes.ts';
import {
  cleJour,
  dateCourte,
  dateLongue,
  datesSuivi,
} from '../livraison-dates.ts';
import type { CompteSaisie } from './Compte.tsx';
import type { LivraisonChoix } from './Livraison.tsx';
import type { Commande } from './Pistes.tsx';

// Écran « 10 · Commande confirmée » de la maquette Figma : le bandeau photo
// avec le numéro et la date de livraison prévue, le suivi de la commande à
// gauche, le kit commandé et l'aide à droite

// Front seulement : rien n'est enregistré (ni appel à l'API, ni route, ni
// table). Le numéro et la date viennent de l'état d'App.tsx, les dates du
// suivi de livraison-dates.ts ; les liens vers Mon compte viendront

export type ConfirmationCommande = {
  // Le moment de la confirmation
  date: Date;
  // E-AAMM-NNNN
  numero: string;
};

type Props = {
  signature: string;
  commande: Commande;
  compte: CompteSaisie;
  livraison: LivraisonChoix;
  confirmation: ConfirmationCommande;
};

// fait : pastille foncée cochée ; en-cours : pastille verte ; a-venir : vide
type EtatEtape = 'fait' | 'en-cours' | 'a-venir';

type Etape = {
  titre: string;
  texte: string;
  etat: EtatEtape;
  // Une date, avec « Prévue le » si elle est à venir, ou un texte
  date: { jour: Date; prevue: boolean } | string;
};

const BIENTOT = 'Bientôt disponible';

// La ligne sous les pistes : le mode, puis l'adresse choisie à l'écran 09
function ligneLivraison(livraison: LivraisonChoix, societe: string): string {
  if (livraison.mode === 'main-propre') {
    return 'Remise en main propre par votre interlocuteur';
  }
  const mode = livraison.mode === 'express' ? 'express' : 'standard';
  const adresse =
    livraison.adresse === 'siege'
      ? `au siège, ${societe}`
      : 'au laboratoire R&D';
  return `Livraison ${mode} ${adresse}`;
}

function DateEtape({ date }: { date: Etape['date'] }) {
  if (typeof date === 'string') return <>{date}</>;
  return (
    <>
      {date.prevue && 'Prévue le '}
      <time dateTime={cleJour(date.jour)}>{dateCourte(date.jour)}</time>
    </>
  );
}

export function Confirmation({
  signature,
  commande,
  compte,
  livraison,
  confirmation,
}: Props) {
  const pistes = pistesPour(signature).filter((p) => p.id in commande.pistes);
  const dates = datesSuivi(confirmation.date, livraison.mode);
  const mainPropre = livraison.mode === 'main-propre';

  const etapes: Etape[] = [
    {
      titre: 'Commande confirmée',
      texte: 'Votre interlocuteur a reçu votre demande.',
      etat: 'fait',
      date: { jour: dates.confirmee, prevue: false },
    },
    {
      titre: 'En préparation dans nos laboratoires',
      texte: 'Pesée des formules, mise en mouillettes et en bases produits.',
      etat: 'en-cours',
      date: 'En cours',
    },
    {
      titre: 'Expédiée',
      texte: mainPropre
        ? 'Votre interlocuteur vous contacte pour convenir de la remise.'
        : 'Vous recevrez le lien de suivi du transporteur.',
      etat: 'a-venir',
      date: dates.expediee
        ? { jour: dates.expediee, prevue: true }
        : 'À convenir',
    },
    {
      titre: 'Livrée',
      texte: mainPropre
        ? 'Votre interlocuteur vous remet votre kit.'
        : 'Votre kit arrive à l’adresse choisie.',
      etat: 'a-venir',
      date: dates.livree ? { jour: dates.livree, prevue: true } : 'À convenir',
    },
    {
      titre: 'À vous de sentir',
      texte:
        'Évaluez chaque piste depuis Mon compte : votre brief final en dépend.',
      etat: 'a-venir',
      date: 'Après réception',
    },
  ];

  return (
    <div className="confirmation-page">
      <section
        className="confirmation-bandeau"
        aria-labelledby="confirmation-titre"
      >
        <img className="confirmation-photo" src={coton} alt="" />
        <div className="confirmation-bandeau-texte">
          <p className="confirmation-badge">✓ Commande confirmée</p>
          <h1 id="confirmation-titre">
            Votre kit d’échantillons est en préparation
          </h1>
          <p className="confirmation-chapo">
            Nos laboratoires préparent vos pistes. Vous serez prévenu à chaque
            étape, jusqu’à la livraison.
          </p>
        </div>
        <dl className="confirmation-reperes">
          <div>
            <dt>Commande</dt>
            <dd>{confirmation.numero}</dd>
          </div>
          <div>
            <dt>Livraison prévue</dt>
            <dd>
              {dates.livree ? (
                <time dateTime={cleJour(dates.livree)}>
                  {dateLongue(dates.livree)}
                </time>
              ) : (
                'À convenir avec votre interlocuteur'
              )}
            </dd>
          </div>
        </dl>
      </section>

      <div className="confirmation-contenu">
        <section
          className="confirmation-suivi"
          aria-labelledby="confirmation-suivi-titre"
        >
          <h2 id="confirmation-suivi-titre">Où en est votre commande&nbsp;?</h2>
          <ol className="confirmation-etapes">
            {etapes.map((e) => (
              <li
                key={e.titre}
                className={`confirmation-etape ${e.etat}`}
                aria-current={e.etat === 'en-cours' ? 'step' : undefined}
              >
                <span className="confirmation-pastille" aria-hidden="true">
                  {e.etat === 'fait' ? '✓' : ''}
                </span>
                <span className="confirmation-etape-texte">
                  <strong>
                    {e.titre}
                    {e.etat === 'fait' && (
                      <span className="sr-only"> (étape terminée)</span>
                    )}
                  </strong>
                  <span>{e.texte}</span>
                </span>
                <span className="confirmation-etape-date">
                  <DateEtape date={e.date} />
                </span>
              </li>
            ))}
          </ol>

          {/* Mon compte n'existe pas encore : visibles, désactivés */}
          <div className="confirmation-actions">
            <button type="button" className="bouton" disabled title={BIENTOT}>
              Suivre ma livraison dans Mon compte
            </button>
            <button
              type="button"
              className="bouton secondaire"
              disabled
              title={BIENTOT}
            >
              ↓ Télécharger le bon de commande
            </button>
          </div>
        </section>

        <div className="confirmation-cote">
          <section
            className="panier confirmation-kit"
            aria-labelledby="confirmation-kit-titre"
          >
            <div className="panier-haut">
              <h2 id="confirmation-kit-titre">Votre kit</h2>
            </div>

            <LignesPanier
              pistes={pistes}
              quantites={commande.pistes}
              formats={commande.formats}
              libelle="court"
            />

            <p className="confirmation-livraison">
              {ligneLivraison(livraison, compte.societe.trim())}
            </p>

            <button
              type="button"
              className="confirmation-suivre"
              disabled
              title={BIENTOT}
            >
              <img src={iconePersonne} alt="" width={18} height={18} />
              Suivre cette livraison depuis Mon compte
            </button>
          </section>

          <section
            className="confirmation-aide"
            aria-labelledby="confirmation-aide-titre"
          >
            <span className="confirmation-aide-icone">
              <img src={iconeTelephone} alt="" width={20} height={20} />
            </span>
            <div className="confirmation-aide-texte">
              <h2 id="confirmation-aide-titre">
                Une question sur votre commande&nbsp;?
              </h2>
              <p>
                Votre interlocuteur Givaudan suit votre projet et vous
                accompagne à chaque étape.
              </p>
              <button
                type="button"
                className="confirmation-lien"
                disabled
                title={BIENTOT}
              >
                Contacter mon interlocuteur
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
