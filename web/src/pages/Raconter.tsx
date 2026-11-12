import type { FormEvent } from 'react';
import type { AnalyseState } from '../App.tsx';
import iconeAssistant from '../assets/icone-assistant.svg';
import iconeDicter from '../assets/icone-dicter.svg';
import iconeEcrire from '../assets/icone-ecrire.svg';
import iconePhoto from '../assets/icone-photo.svg';
import pointDirect from '../assets/point-direct.svg';
import radioActif from '../assets/radio-actif.svg';
import radio from '../assets/radio.svg';
import { Etapes } from '../components/Etapes.tsx';

// Écran « 01 · Raconter — écrire » de la maquette Figma

type Props = {
  text: string;
  onTextChange: (text: string) => void;
  state: AnalyseState;
  // Le souvenir a changé depuis la dernière analyse : elle n'est plus à jour
  perime: boolean;
  onAnalyser: () => void;
  onSuivant: () => void;
};

export function Raconter({
  text,
  onTextChange,
  state,
  perime,
  onAnalyser,
  onSuivant,
}: Props) {
  const loading = state.kind === 'loading';
  const analysis = state.kind === 'done' ? state.analysis : null;
  // On analyse un souvenir non vide, s'il n'a pas déjà son analyse à jour
  const peutAnalyser =
    text.trim() !== '' && !loading && (state.kind !== 'done' || perime);
  // On ne passe à la suite qu'avec une analyse terminée et à jour
  const peutContinuer = state.kind === 'done' && !perime;

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (peutAnalyser) onAnalyser();
  }

  return (
    <form className="raconter" onSubmit={onSubmit}>
      <div className="contenu">
        <div className="saisie">
          <Etapes courante={0} />

          <div className="titre">
            <h1>Racontez votre souvenir</h1>
            <p>
              Choisissez comment vous préférez le raconter. Vous pourrez
              combiner plusieurs façons.
            </p>
          </div>

          <div
            className="modes"
            role="radiogroup"
            aria-label="Façon de raconter"
          >
            <Mode
              icone={iconeEcrire}
              titre="Écrire"
              description="Décrivez librement, en quelques phrases."
              actif
            />
            <Mode
              icone={iconeDicter}
              titre="Dicter"
              description="Racontez à voix haute, nous transcrivons."
            />
            <Mode
              icone={iconePhoto}
              titre="Importer une photo"
              description="Un lieu, une matière, une ambiance."
            />
          </div>

          <div className="zone-saisie">
            <label htmlFor="souvenir">Votre souvenir</label>
            <textarea
              id="souvenir"
              value={text}
              onChange={(e) => onTextChange(e.target.value)}
              placeholder="Un hôtel en Thaïlande, au milieu de la végétation, juste après la pluie. L'air était chaud et humide, des fleurs blanches partout, une odeur de bois mouillé. Je me sentais apaisée."
              maxLength={5000}
              disabled={loading}
            />
            <div className="evoquer">
              <span>Pensez à évoquer :</span>
              <Rappel ok={!!analysis?.comprehension.lieu}>le lieu</Rappel>
              <Rappel ok={!!analysis?.comprehension.moment}>le moment</Rappel>
              <Rappel ok={!!analysis?.comprehension.elements.length}>
                ce que vous sentiez
              </Rappel>
              <Rappel ok={!!analysis?.comprehension.emotion}>
                ce que vous ressentiez
              </Rappel>
            </div>
          </div>
        </div>

        <Perception state={state} perime={perime} />
      </div>

      <div className="barre">
        <button type="button" className="bouton secondaire" disabled>
          ← Retour
        </button>
        <div className="barre-droite">
          <button
            type="submit"
            className="bouton secondaire"
            disabled={!peutAnalyser}
          >
            {loading ? 'Analyse en cours…' : 'Analyser mon souvenir'}
          </button>
          <button
            type="button"
            className="bouton"
            disabled={!peutContinuer}
            title={
              peutContinuer ? undefined : "Analysez d'abord votre souvenir"
            }
            onClick={onSuivant}
          >
            Suivant →
          </button>
        </div>
      </div>
    </form>
  );
}

// Seul « Écrire » est disponible : dicter et importer une photo viendront
function Mode(props: {
  icone: string;
  titre: string;
  description: string;
  actif?: boolean;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={!!props.actif}
      disabled={!props.actif}
      title={props.actif ? undefined : 'Bientôt disponible'}
      className={props.actif ? 'mode actif' : 'mode'}
    >
      <span className="mode-haut">
        <span className="mode-icone">
          <img src={props.icone} alt="" width={22} height={22} />
        </span>
        <img
          src={props.actif ? radioActif : radio}
          alt=""
          width={18}
          height={18}
        />
      </span>
      <span className="mode-titre">{props.titre}</span>
      <span className="mode-description">{props.description}</span>
    </button>
  );
}

function Rappel({ ok, children }: { ok: boolean; children: string }) {
  return (
    <span className={ok ? 'rappel ok' : 'rappel'}>
      {ok && '✓ '}
      {children}
    </span>
  );
}

// Le panneau « Ce que l'IA perçoit », rempli par la compréhension de l'IA
function Perception({
  state,
  perime,
}: {
  state: AnalyseState;
  perime: boolean;
}) {
  const c = state.kind === 'done' ? state.analysis.comprehension : null;
  const categories = [
    { nom: 'Lieu', teinte: 'bleu', valeurs: [c?.lieu] },
    { nom: 'Moment', teinte: 'orange', valeurs: [c?.moment, c?.meteo] },
    { nom: 'Sensations', teinte: 'vert', valeurs: c?.elements ?? [] },
    { nom: 'Émotion', teinte: 'violet', valeurs: [c?.emotion] },
  ].map((cat) => ({
    ...cat,
    valeurs: cat.valeurs.filter((v): v is string => !!v),
  }));
  const remplies = categories.filter((cat) => cat.valeurs.length > 0).length;
  const manquantes =
    state.kind === 'done' ? state.analysis.informations_manquantes : [];

  const statut = {
    idle: 'En attente',
    loading: 'Analyse…',
    done: perime ? 'À mettre à jour' : 'À jour',
    error: 'Erreur',
  }[state.kind];

  return (
    <aside className="perception" aria-live="polite">
      <div className="perception-haut">
        <div>
          <h2>Ce que l'IA perçoit</h2>
          <p>Mise à jour à chaque envoi</p>
        </div>
        <span className={`direct ${state.kind}${perime ? ' perime' : ''}`}>
          <img src={pointDirect} alt="" width={8} height={8} />
          {statut}
        </span>
      </div>

      <dl className="categories">
        {categories.map((cat) => (
          <div key={cat.nom} className={`categorie ${cat.teinte}`}>
            <span className="pastille" aria-hidden="true" />
            <dt>{cat.nom}</dt>
            <dd>
              {cat.valeurs.length === 0 ? (
                <span className="vide">—</span>
              ) : (
                cat.valeurs.map((v) => (
                  <span key={v} className="puce">
                    {v}
                  </span>
                ))
              )}
            </dd>
          </div>
        ))}
      </dl>

      <div className="richesse">
        <div className="richesse-texte">
          <span>Richesse de votre souvenir</span>
          <strong>{remplies * 25} %</strong>
        </div>
        <div
          className="richesse-barres"
          role="meter"
          aria-label="Richesse de votre souvenir"
          aria-valuemin={0}
          aria-valuemax={4}
          aria-valuenow={remplies}
        >
          {categories.map((cat, i) => (
            <span
              key={cat.nom}
              className={i < remplies ? 'plein' : undefined}
            />
          ))}
        </div>
      </div>

      <div className="assistant">
        <span className="assistant-icone">
          <img src={iconeAssistant} alt="" width={16} height={16} />
        </span>
        <div
          className={state.kind === 'error' ? 'bulle erreur' : 'bulle'}
          role={state.kind === 'error' ? 'alert' : undefined}
        >
          {state.kind === 'idle' &&
            'Racontez votre souvenir puis cliquez sur « Analyser mon souvenir » : j’en tirerai le lieu, le moment, les sensations et l’émotion.'}
          {state.kind === 'loading' && (
            <span className="status">
              <span className="spinner" aria-hidden="true" />
              J’analyse votre souvenir… (20 s et plus)
            </span>
          )}
          {state.kind === 'error' && state.message}
          {state.kind === 'done' &&
            perime &&
            'Votre souvenir a changé : analysez-le de nouveau pour mettre à jour.'}
          {state.kind === 'done' &&
            !perime &&
            (manquantes.length > 0
              ? `Pour affiner : ${manquantes.join(' · ')}`
              : 'Votre souvenir est riche : passez à la suite.')}
        </div>
      </div>
    </aside>
  );
}
