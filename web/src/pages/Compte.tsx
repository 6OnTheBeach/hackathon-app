import { useState, type FormEvent } from 'react';
import foret from '../assets/compte-foret.png';
import iconeBriefs from '../assets/icone-briefs.svg';
import iconeEvaluation from '../assets/icone-evaluation.svg';
import iconeInterlocuteur from '../assets/icone-interlocuteur.svg';
import iconeSuivi from '../assets/icone-suivi.svg';
import { Etapes } from '../components/Etapes.tsx';

// Écran « 08 · Créer un compte » de la maquette Figma : ce que le compte
// apporte, sur la photo à gauche, et le formulaire d'inscription à droite

// Front seulement : rien n'est enregistré (ni appel à l'API, ni route, ni
// table). Le compte sera créé côté API dans un prochain ticket ; un
// formulaire valide mène à l'écran 09 · Livraison

const AVANTAGES = [
  {
    icone: iconeSuivi,
    titre: 'Suivi en temps réel',
    texte: 'Chaque étape de livraison, de la pesée à votre porte.',
  },
  {
    icone: iconeBriefs,
    titre: 'Vos briefs et pistes',
    texte: 'Tous vos projets réunis au même endroit.',
  },
  {
    icone: iconeEvaluation,
    titre: 'Évaluation en ligne',
    texte: 'Donnez vos retours sur chaque échantillon.',
  },
  {
    icone: iconeInterlocuteur,
    titre: 'Votre interlocuteur',
    texte: 'Échangez avec lui à chaque étape du projet.',
  },
];

const ETAPES_COMMANDE = ['Pistes', 'Compte', 'Livraison'];

// Une vérification de forme seulement : quelque chose, un @, un point
const FORME_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type CompteSaisie = {
  prenom: string;
  nom: string;
  societe: string;
  email: string;
  // Facultatif, sans contrôle de format
  telephone: string;
  // Gardé en mémoire le temps du parcours, jamais envoyé
  motDePasse: string;
  conditions: boolean;
  sms: boolean;
};

type ChampTexte =
  'prenom' | 'nom' | 'societe' | 'email' | 'telephone' | 'motDePasse';
// Le téléphone, facultatif, n'est jamais en erreur
type Erreurs = Partial<
  Record<Exclude<ChampTexte, 'telephone'> | 'conditions', string>
>;

// Dans l'ordre de la page : le premier champ en erreur reçoit le focus
const ORDRE: (keyof Erreurs)[] = [
  'prenom',
  'nom',
  'societe',
  'email',
  'motDePasse',
  'conditions',
];

function verifier(saisie: CompteSaisie): Erreurs {
  const erreurs: Erreurs = {};
  if (saisie.prenom.trim() === '') erreurs.prenom = 'Indiquez votre prénom.';
  if (saisie.nom.trim() === '') erreurs.nom = 'Indiquez votre nom.';
  if (saisie.societe.trim() === '') erreurs.societe = 'Indiquez votre société.';
  if (saisie.email.trim() === '')
    erreurs.email = 'Indiquez votre e-mail professionnel.';
  else if (!FORME_EMAIL.test(saisie.email.trim()))
    erreurs.email =
      'Cet e-mail n’est pas valide (exemple : prenom.nom@marque.com).';
  // Aucune règle sur le mot de passe pour l'instant : elles seront définies
  // avec l'équipe Data
  if (saisie.motDePasse === '')
    erreurs.motDePasse = 'Choisissez un mot de passe.';
  if (!saisie.conditions)
    erreurs.conditions = 'Acceptez les conditions pour créer votre compte.';
  return erreurs;
}

const idChamp = (champ: ChampTexte | 'conditions') => `compte-${champ}`;
const idErreur = (champ: ChampTexte | 'conditions') => `compte-${champ}-erreur`;

type Props = {
  saisie: CompteSaisie;
  onSaisieChange: (saisie: CompteSaisie) => void;
  onRetour: () => void;
  // Vers l'écran 09 · Livraison, une fois le formulaire valide
  onSuivant: () => void;
};

export function Compte({ saisie, onSaisieChange, onRetour, onSuivant }: Props) {
  // Les erreurs n'apparaissent qu'après un clic sur « Créer mon compte »
  const [erreurs, setErreurs] = useState<Erreurs>({});

  // Corriger un champ efface son message, sans attendre le prochain clic
  function changer<K extends keyof CompteSaisie>(
    champ: K,
    valeur: CompteSaisie[K],
  ) {
    onSaisieChange({ ...saisie, [champ]: valeur });
    if (champ in erreurs) {
      const suivantes = { ...erreurs };
      delete suivantes[champ as keyof Erreurs];
      setErreurs(suivantes);
    }
  }

  function creer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trouvees = verifier(saisie);
    setErreurs(trouvees);
    const premier = ORDRE.find((champ) => champ in trouvees);
    if (premier) {
      document.getElementById(idChamp(premier))?.focus();
      return;
    }
    onSuivant();
  }

  // Les props communes d'un champ texte : valeur, message d'erreur relié
  function champ(nom: ChampTexte, aide?: string) {
    const erreur = nom === 'telephone' ? undefined : erreurs[nom];
    const decrit = [aide, erreur ? idErreur(nom) : undefined]
      .filter(Boolean)
      .join(' ');
    return {
      id: idChamp(nom),
      name: nom,
      value: saisie[nom],
      onChange: (e: { target: { value: string } }) =>
        changer(nom, e.target.value),
      'aria-invalid': erreur ? true : undefined,
      'aria-describedby': decrit || undefined,
    };
  }

  function message(nom: keyof Erreurs) {
    const erreur = erreurs[nom];
    return erreur ? (
      <p className="compte-erreur" id={idErreur(nom)}>
        {erreur}
      </p>
    ) : null;
  }

  return (
    <div className="compte-page">
      <section
        className="compte-visuel"
        style={{ backgroundImage: `url(${foret})` }}
        aria-labelledby="compte-visuel-titre"
      >
        <h2 id="compte-visuel-titre">
          Suivez votre fragrance, du laboratoire jusqu’à vous
        </h2>
        <ul className="compte-avantages">
          {AVANTAGES.map((a) => (
            <li key={a.titre}>
              <img src={a.icone} alt="" width={22} height={22} />
              <strong>{a.titre}</strong>
              <span>{a.texte}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="compte-cote">
        <div className="compte-formulaire">
          <Etapes
            etapes={ETAPES_COMMANDE}
            courante={1}
            label="Étapes de la commande"
          />
          <div className="titre">
            <h1>Créez votre compte</h1>
            <p>
              Votre panier est conservé. Un compte suffit pour toutes vos
              commandes et le suivi de vos livraisons.
            </p>
          </div>

          {/* Seule la création est disponible : la connexion viendra */}
          <div className="compte-onglets">
            <button type="button" className="actif" aria-pressed={true}>
              Créer un compte
            </button>
            <button
              type="button"
              aria-pressed={false}
              disabled
              title="Bientôt disponible"
            >
              J’ai déjà un compte
            </button>
          </div>

          <button
            type="button"
            className="bouton secondaire compte-pro"
            disabled
            title="Bientôt disponible"
          >
            Continuer avec mon compte professionnel
          </button>

          <p className="compte-ou">
            <span>ou</span>
          </p>

          <form className="compte-champs" noValidate onSubmit={creer}>
            <div className="compte-ligne">
              <div className="compte-champ">
                <label htmlFor={idChamp('prenom')}>Prénom</label>
                <input
                  type="text"
                  autoComplete="given-name"
                  {...champ('prenom')}
                />
                {message('prenom')}
              </div>
              <div className="compte-champ">
                <label htmlFor={idChamp('nom')}>Nom</label>
                <input
                  type="text"
                  autoComplete="family-name"
                  {...champ('nom')}
                />
                {message('nom')}
              </div>
            </div>

            <div className="compte-champ">
              <label htmlFor={idChamp('societe')}>Société</label>
              <input
                type="text"
                autoComplete="organization"
                placeholder="Votre marque"
                {...champ('societe')}
              />
              {message('societe')}
            </div>

            <div className="compte-champ">
              <label htmlFor={idChamp('email')}>E-mail professionnel</label>
              <input
                type="email"
                autoComplete="email"
                placeholder="prenom.nom@marque.com"
                {...champ('email')}
              />
              {message('email')}
            </div>

            <div className="compte-champ">
              <label htmlFor={idChamp('telephone')}>
                Téléphone (facultatif)
              </label>
              <input type="tel" autoComplete="tel" {...champ('telephone')} />
            </div>

            <div className="compte-champ">
              <label htmlFor={idChamp('motDePasse')}>Mot de passe</label>
              <input
                type="password"
                autoComplete="new-password"
                {...champ('motDePasse', 'compte-motDePasse-aide')}
              />
              <p className="compte-aide" id="compte-motDePasse-aide">
                12 caractères minimum, avec un chiffre
              </p>
              {message('motDePasse')}
            </div>

            <div className="compte-cases">
              <div>
                <label
                  className={
                    saisie.conditions ? 'compte-case coche' : 'compte-case'
                  }
                >
                  <input
                    type="checkbox"
                    id={idChamp('conditions')}
                    checked={saisie.conditions}
                    onChange={(e) => changer('conditions', e.target.checked)}
                    aria-invalid={erreurs.conditions ? true : undefined}
                    aria-describedby={
                      erreurs.conditions ? idErreur('conditions') : undefined
                    }
                  />
                  <span className="case" aria-hidden="true">
                    {saisie.conditions ? '✓' : ''}
                  </span>
                  <span>
                    J’accepte les conditions d’utilisation et la politique de
                    confidentialité de Givaudan.
                  </span>
                </label>
                {message('conditions')}
              </div>
              <label
                className={saisie.sms ? 'compte-case coche' : 'compte-case'}
              >
                <input
                  type="checkbox"
                  checked={saisie.sms}
                  onChange={(e) => changer('sms', e.target.checked)}
                />
                <span className="case" aria-hidden="true">
                  {saisie.sms ? '✓' : ''}
                </span>
                <span>Me prévenir par SMS à chaque étape de la livraison.</span>
              </label>
            </div>

            <button type="submit" className="bouton compte-creer">
              Créer mon compte et continuer
            </button>
          </form>
        </div>

        <div className="barre">
          <button
            type="button"
            className="bouton secondaire"
            onClick={onRetour}
          >
            ← Retour aux pistes
          </button>
          <p className="compte-commande">
            Commande d’échantillons, étape 2 sur 3
          </p>
        </div>
      </div>
    </div>
  );
}
