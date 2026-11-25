import { useRef, useState } from 'react';
import radioActif from '../assets/radio-actif.svg';
import radio from '../assets/radio.svg';
import { LignesPanier } from '../components/LignesPanier.tsx';
import {
  ADRESSES,
  libelleAdresse,
  ligneAdresse,
  type IdAdresse,
} from '../mocks/adresses.ts';
import { pistesPour } from '../mocks/pistes.ts';
import type { CompteSaisie } from './Compte.tsx';
import type { Commande } from './Pistes.tsx';

// Écran « 09 · Livraison et récapitulatif » de la maquette Figma : les
// coordonnées, l'adresse, le mode de livraison et un mot pour les équipes à
// gauche, le récapitulatif de la commande à droite

// Front seulement : rien n'est enregistré (ni appel à l'API, ni route, ni
// table). Les adresses viennent de mocks/adresses.ts, des données de
// démonstration ; la confirmation n'affiche qu'un message

export type ModeLivraison = 'standard' | 'express' | 'main-propre';

export type LivraisonChoix = {
  adresse: IdAdresse;
  mode: ModeLivraison;
  // Un mot pour les équipes, facultatif
  note: string;
  // Les conditions d'échantillonnage, à cocher avant de confirmer
  conditions: boolean;
};

// Dans l'ordre d'affichage. detail : sous le titre de la carte ; recap :
// dans la ligne Livraison du récapitulatif, après le titre
const MODES: Record<
  ModeLivraison,
  { id: ModeLivraison; titre: string; detail: string; recap: string }
> = {
  standard: {
    id: 'standard',
    titre: 'Standard',
    detail: '3 à 5 jours ouvrés',
    recap: '3 à 5 jours ouvrés',
  },
  express: {
    id: 'express',
    titre: 'Express',
    detail: '24 à 48 heures',
    recap: '24 à 48 heures',
  },
  'main-propre': {
    id: 'main-propre',
    titre: 'En main propre',
    detail: 'Remis par votre interlocuteur',
    recap: 'remis par votre interlocuteur',
  },
};

const ID_CONDITIONS = 'livraison-conditions';
const ID_ERREUR = 'livraison-conditions-erreur';

type Props = {
  signature: string;
  commande: Commande;
  compte: CompteSaisie;
  choix: LivraisonChoix;
  onChoixChange: (choix: LivraisonChoix) => void;
  // Les deux mènent à l'écran 08 · Créer un compte, la saisie intacte
  onModifier: () => void;
  onRetour: () => void;
};

// Le bouton radio de la maquette, dessiné à côté du vrai <input>, masqué
function Pastille({ actif }: { actif: boolean }) {
  return (
    <img
      className="livraison-radio"
      src={actif ? radioActif : radio}
      alt=""
      width={18}
      height={18}
    />
  );
}

// Le numéro et le titre d'une carte
function TitreCarte({ numero, titre }: { numero: number; titre: string }) {
  return (
    <>
      <span className="livraison-numero" aria-hidden="true">
        {numero}
      </span>
      {titre}
    </>
  );
}

export function Livraison({
  signature,
  commande,
  compte,
  choix,
  onChoixChange,
  onModifier,
  onRetour,
}: Props) {
  // Le message de la case n'apparaît qu'après un clic sur « Confirmer »
  const [erreur, setErreur] = useState(false);
  const [confirmee, setConfirmee] = useState(false);
  const caseRef = useRef<HTMLInputElement>(null);

  const pistes = pistesPour(signature).filter((p) => p.id in commande.pistes);
  const mode = MODES[choix.mode];
  const adresse = ADRESSES[choix.adresse];
  const nom = `${compte.prenom.trim()} ${compte.nom.trim()}`.trim();
  const telephone = compte.telephone.trim();

  // Changer un choix annule une confirmation déjà affichée
  function changer<K extends keyof LivraisonChoix>(
    champ: K,
    valeur: LivraisonChoix[K],
  ) {
    onChoixChange({ ...choix, [champ]: valeur });
    if (champ === 'conditions' && valeur) setErreur(false);
    setConfirmee(false);
  }

  function confirmer() {
    if (!choix.conditions) {
      setErreur(true);
      setConfirmee(false);
      caseRef.current?.focus();
      return;
    }
    setConfirmee(true);
  }

  return (
    <div className="livraison-page">
      <div className="livraison-contenu">
        <div className="livraison-gauche">
          <div className="livraison-titre">
            <h1>Où livrer vos échantillons&nbsp;?</h1>
            <p>
              Vérifiez vos informations&nbsp;: nos laboratoires préparent votre
              kit dès la confirmation.
            </p>
          </div>

          <section
            className="livraison-carte"
            aria-labelledby="livraison-coordonnees"
          >
            <div className="livraison-carte-haut">
              <h2 id="livraison-coordonnees" className="livraison-carte-titre">
                <TitreCarte numero={1} titre="Vos coordonnées" />
              </h2>
              <span className="livraison-badge">✓ Compte créé</span>
              <button
                type="button"
                className="livraison-modifier"
                onClick={onModifier}
                aria-label="Modifier vos coordonnées"
              >
                Modifier
              </button>
            </div>
            <dl className="livraison-coordonnees">
              <div>
                <dt>Nom</dt>
                <dd>{nom}</dd>
              </div>
              <div>
                <dt>Société</dt>
                <dd>{compte.societe.trim()}</dd>
              </div>
              <div>
                <dt>E-mail</dt>
                <dd>{compte.email.trim()}</dd>
              </div>
              <div>
                <dt>Téléphone</dt>
                <dd>{telephone || 'Non renseigné'}</dd>
              </div>
            </dl>
          </section>

          <fieldset className="livraison-carte">
            <legend className="livraison-carte-titre">
              <TitreCarte numero={2} titre="Adresse de livraison" />
            </legend>
            <div className="livraison-adresses">
              {Object.values(ADRESSES).map((a) => {
                const actif = choix.adresse === a.id;
                return (
                  <label
                    key={a.id}
                    className={
                      actif ? 'livraison-option actif' : 'livraison-option'
                    }
                  >
                    <input
                      type="radio"
                      name="livraison-adresse"
                      value={a.id}
                      checked={actif}
                      onChange={() => changer('adresse', a.id)}
                    />
                    <Pastille actif={actif} />
                    <span className="livraison-option-texte">
                      <strong>
                        {libelleAdresse(a, compte.societe.trim())}
                      </strong>
                      <span>{ligneAdresse(a)}</span>
                    </span>
                  </label>
                );
              })}
              {/* Pas encore de saisie d'adresse : visible, désactivée */}
              <label
                className="livraison-option desactive"
                title="Bientôt disponible"
              >
                <input
                  type="radio"
                  name="livraison-adresse"
                  value="nouvelle"
                  checked={false}
                  disabled
                  readOnly
                />
                <Pastille actif={false} />
                <span className="livraison-option-texte">
                  <strong>Nouvelle adresse</strong>
                  <span>Livrer ailleurs</span>
                </span>
              </label>
            </div>
          </fieldset>

          <fieldset className="livraison-carte">
            <legend className="livraison-carte-titre">
              <TitreCarte numero={3} titre="Mode de livraison" />
            </legend>
            <div className="livraison-modes">
              {Object.values(MODES).map((m) => {
                const actif = choix.mode === m.id;
                return (
                  <label
                    key={m.id}
                    className={
                      actif
                        ? 'livraison-option livraison-mode actif'
                        : 'livraison-option livraison-mode'
                    }
                  >
                    <input
                      type="radio"
                      name="livraison-mode"
                      value={m.id}
                      checked={actif}
                      onChange={() => changer('mode', m.id)}
                    />
                    <span className="livraison-option-texte">
                      <strong>{m.titre}</strong>
                      <span>{m.detail}</span>
                    </span>
                    <Pastille actif={actif} />
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="livraison-carte">
            <label
              htmlFor="livraison-note"
              className="livraison-carte-titre livraison-carte-haut"
            >
              <TitreCarte numero={4} titre="Un mot pour nos équipes" />
              <span className="livraison-facultatif">(facultatif)</span>
            </label>
            <p className="livraison-aide" id="livraison-note-aide">
              Instructions de livraison, collègues à prévenir, contraintes de
              réception…
            </p>
            <textarea
              id="livraison-note"
              className="livraison-note"
              rows={4}
              value={choix.note}
              onChange={(e) => changer('note', e.target.value)}
              aria-describedby="livraison-note-aide"
              placeholder="Par exemple : livraison au laboratoire R&D, à l'attention de l'équipe formulation."
            />
          </div>
        </div>

        <aside className="panier livraison-recap" aria-labelledby="recap-titre">
          <div className="panier-haut">
            <h2 id="recap-titre">Récapitulatif</h2>
          </div>

          <LignesPanier
            pistes={pistes}
            quantites={commande.pistes}
            formats={commande.formats}
            libelle="court"
          />

          <dl className="panier-infos">
            <div>
              <dt>Livraison</dt>
              <dd>
                {mode.titre}, {mode.recap}
              </dd>
            </div>
            <div>
              <dt>Adresse</dt>
              <dd>{libelleAdresse(adresse, compte.societe.trim())}</dd>
            </div>
            <div>
              <dt>Conditions</dt>
              <dd>Selon votre accord Givaudan</dd>
            </div>
          </dl>

          <div>
            <label
              className={
                choix.conditions ? 'livraison-case coche' : 'livraison-case'
              }
            >
              <input
                type="checkbox"
                id={ID_CONDITIONS}
                ref={caseRef}
                checked={choix.conditions}
                onChange={(e) => changer('conditions', e.target.checked)}
                aria-invalid={erreur ? true : undefined}
                aria-describedby={erreur ? ID_ERREUR : undefined}
              />
              <span className="case" aria-hidden="true">
                {choix.conditions ? '✓' : ''}
              </span>
              <span>
                J’ai lu les conditions d’échantillonnage et de confidentialité
                du projet.
              </span>
            </label>
            {erreur && (
              <p className="livraison-erreur" id={ID_ERREUR}>
                Cochez cette case pour confirmer votre commande.
              </p>
            )}
          </div>

          <button
            type="button"
            className="bouton livraison-confirmer"
            onClick={confirmer}
          >
            Confirmer ma commande
          </button>
          <p className="livraison-confirmation" role="status">
            {confirmee ? 'Commande confirmée (démonstration)' : ''}
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
