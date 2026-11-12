import type { FormEvent } from 'react';
import type { AnalyseState } from '../App.tsx';
import type { Analysis } from '../api.ts';
import iconeAssistant from '../assets/icone-assistant.svg';
import iconeDicter from '../assets/icone-dicter.svg';
import iconeEcrire from '../assets/icone-ecrire.svg';
import iconePhoto from '../assets/icone-photo.svg';
import radioActif from '../assets/radio-actif.svg';
import radio from '../assets/radio.svg';
import { Etapes } from '../components/Etapes.tsx';
import { SOUVENIRS_EXEMPLES } from '../mocks/souvenirs.ts';

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

  // Ajoute un mot proposé par l'assistant à la fin du souvenir
  function ajouterMot(mot: string) {
    const debut = text.trimEnd();
    if (debut === '') return onTextChange(mot);
    onTextChange(`${debut}${/[.!?…]$/.test(debut) ? ' ' : ', '}${mot}`);
  }

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
            <div className="exemples">
              <span>Exemples (démonstration)&nbsp;:</span>
              {SOUVENIRS_EXEMPLES.map((ex) => (
                <button
                  key={ex.titre}
                  type="button"
                  className="exemple"
                  disabled={loading}
                  onClick={() => onTextChange(ex.texte)}
                >
                  {ex.titre}
                </button>
              ))}
            </div>
            <div className="evoquer">
              <span>Pensez à évoquer&nbsp;:</span>
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

        <Perception state={state} perime={perime} onAjouterMot={ajouterMot} />
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

// Le panneau « Ce que l'IA perçoit », construit après l'envoi à partir de
// l'analyse renvoyée par l'API (l'IA met de 20 à 120 s : pas de mise à jour
// à chaque mot)
function Perception({
  state,
  perime,
  onAjouterMot,
}: {
  state: AnalyseState;
  perime: boolean;
  onAjouterMot: (mot: string) => void;
}) {
  return (
    <aside className="perception" aria-live="polite">
      <div className="perception-haut">
        <div>
          <h2>Ce que l'IA perçoit</h2>
          <p>Après l'analyse de votre souvenir</p>
        </div>
        {state.kind === 'done' && state.model === 'mock' && (
          <span className="simulee" title={DETAIL_SIMULEE}>
            {MENTION_SIMULEE}
          </span>
        )}
      </div>

      {state.kind === 'done' ? (
        <Comprehension
          analysis={state.analysis}
          perime={perime}
          onAjouterMot={onAjouterMot}
        />
      ) : (
        <div className="assistant">
          <span className="assistant-icone">
            <img src={iconeAssistant} alt="" width={16} height={16} />
          </span>
          <div
            className={state.kind === 'error' ? 'bulle erreur' : 'bulle'}
            role={state.kind === 'error' ? 'alert' : undefined}
          >
            {state.kind === 'idle' &&
              'Racontez votre souvenir puis cliquez sur « Analyser mon souvenir »\u00A0: j’en tirerai le lieu, le moment, les sensations et l’émotion.'}
            {state.kind === 'loading' && (
              <span className="status">
                <span className="spinner" aria-hidden="true" />
                J’analyse votre souvenir… (de 20 s à 2 min)
              </span>
            )}
            {state.kind === 'error' && state.message}
          </div>
        </div>
      )}
    </aside>
  );
}

const MENTION_SIMULEE = 'Réponse simulée';
const DETAIL_SIMULEE = 'AI_PROVIDER=mock';
const QUESTION_PAR_DEFAUT =
  'Qu’est-ce qui vous a le plus marqué dans ce souvenir\u00A0?';

function Comprehension({
  analysis,
  perime,
  onAjouterMot,
}: {
  analysis: Analysis;
  perime: boolean;
  onAjouterMot: (mot: string) => void;
}) {
  const c = analysis.comprehension;
  const decouper = (texte: string) =>
    texte
      .split(',')
      .map((v) => v.trim())
      .filter((v) => v !== '');
  const categories = [
    { nom: 'Lieu', teinte: 'bleu', valeurs: decouper(c.lieu) },
    {
      nom: 'Moment',
      teinte: 'orange',
      valeurs: [c.moment.trim(), c.meteo.trim()].filter((v) => v !== ''),
    },
    { nom: 'Sensations', teinte: 'vert', valeurs: c.elements },
    {
      nom: 'Émotion',
      teinte: 'violet',
      valeurs: c.emotion.trim() === '' ? [] : [c.emotion.trim()],
    },
  ];

  // Calcul local, pas une sortie de l'IA : la part des cinq champs de la
  // compréhension qui sont remplis (elements compte à partir de 2 éléments)
  const champs = [
    c.lieu.trim() !== '',
    c.moment.trim() !== '',
    c.meteo.trim() !== '',
    c.emotion.trim() !== '',
    c.elements.length >= 2,
  ];
  const remplis = champs.filter(Boolean).length;
  const richesse = Math.round((remplis / champs.length) * 100);

  const question = analysis.informations_manquantes[0] ?? QUESTION_PAR_DEFAUT;
  const suggestions = c.elements.slice(0, 3);

  return (
    <>
      <dl className="categories">
        {categories.map((cat) => (
          <div key={cat.nom} className={`categorie ${cat.teinte}`}>
            <span className="pastille" aria-hidden="true" />
            <dt>{cat.nom}</dt>
            <dd>
              {cat.valeurs.map((v) => (
                <span key={v} className="puce">
                  {v}
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>

      <div className="richesse">
        <div className="richesse-texte">
          <span>Richesse de votre souvenir</span>
          <strong>{richesse} %</strong>
        </div>
        <div
          className="richesse-barres"
          role="meter"
          aria-label="Richesse de votre souvenir"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={richesse}
        >
          {champs.map((_, i) => (
            <span key={i} className={i < remplis ? 'plein' : undefined} />
          ))}
        </div>
      </div>

      <div className="assistant">
        <span className="assistant-icone">
          <img src={iconeAssistant} alt="" width={16} height={16} />
        </span>
        <div className="assistant-contenu">
          <div className="bulle">
            {perime
              ? 'Votre souvenir a changé\u00A0: analysez-le de nouveau pour mettre à jour.'
              : `Pour affiner\u00A0: ${question}`}
          </div>
          {suggestions.length > 0 && (
            <div className="suggestions">
              {suggestions.map((mot) => (
                <button
                  key={mot}
                  type="button"
                  className="suggestion"
                  title="Ajouter ce mot à votre souvenir"
                  onClick={() => onAjouterMot(mot)}
                >
                  {mot}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
