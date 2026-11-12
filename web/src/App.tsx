import { useState } from 'react';
import {
  ApiRequestError,
  createJourney,
  sendMessage,
  type Analysis,
} from './api.ts';
import { Header } from './components/Header.tsx';
import { Explorer, IMAGES } from './pages/Explorer.tsx';
import { pistesPour } from './mocks/pistes.ts';
import { nombreEchantillons, Pistes, type Commande } from './pages/Pistes.tsx';
import { Projet, type ProjetReponses } from './pages/Projet.tsx';
import { Raconter } from './pages/Raconter.tsx';
import { Ressentir } from './pages/Ressentir.tsx';

// Le parcours Scent Journey : un écran par étape, l'état est gardé ici pour
// qu'on puisse revenir en arrière sans rien perdre

export type AnalyseState =
  | { kind: 'idle' }
  | { kind: 'loading' }
  // model : le modèle qui a répondu (« mock » : réponse simulée)
  | { kind: 'done'; analysis: Analysis; model: string }
  | { kind: 'error'; message: string };

// Les écrans 05 · Envoyer ma demande et 06 · Merci ne sont pas encore faits :
// Projet mène directement aux pistes
type Ecran = 'raconter' | 'explorer' | 'ressentir' | 'projet' | 'pistes';

export function App() {
  const [ecran, setEcran] = useState<Ecran>('raconter');
  const [text, setText] = useState('');
  // Le parcours est créé au premier envoi, puis réutilisé
  const [journeyId, setJourneyId] = useState<string | null>(null);
  const [state, setState] = useState<AnalyseState>({ kind: 'idle' });
  // Le souvenir de la dernière analyse réussie : s'il a changé depuis,
  // l'analyse n'est plus à jour
  const [texteAnalyse, setTexteAnalyse] = useState<string | null>(null);
  const [selection, setSelection] = useState<string[]>([]);
  const [projet, setProjet] = useState<ProjetReponses>({
    produits: [],
    marches: [],
  });
  // Les formats choisis dans la maquette, par défaut ; les pistes sont
  // choisies à l'arrivée sur l'écran (voir allerAuxPistes)
  const [commande, setCommande] = useState<Commande>({
    pistes: {},
    formats: ['Mouillettes parfumées', 'Dans vos produits'],
  });
  // Le nombre d'échantillons mis au panier (null : rien d'ajouté)
  const [auPanier, setAuPanier] = useState<number | null>(null);

  const perime = state.kind === 'done' && text.trim() !== texteAnalyse;

  function aller(suivant: Ecran) {
    setEcran(suivant);
    window.scrollTo(0, 0);
  }

  // Les pistes dépendent du souvenir analysé : si la commande en contient
  // d'un autre souvenir, on repart de toutes les pistes de celui-ci
  function allerAuxPistes() {
    if (state.kind !== 'done') return;
    const ids = pistesPour(state.analysis.signature.nom).map((p) => p.id);
    const actuelles = Object.keys(commande.pistes);
    if (actuelles.length === 0 || actuelles.some((id) => !ids.includes(id))) {
      setCommande({
        ...commande,
        pistes: Object.fromEntries(ids.map((id) => [id, 1])),
      });
      setAuPanier(null);
    }
    aller('pistes');
  }

  // L'IA met 20 s et plus : l'utilisateur reste sur l'écran Raconter, qui
  // affiche l'attente, et ne passe à la suite qu'une fois l'analyse terminée
  async function analyser() {
    const souvenir = text.trim();
    if (souvenir === '' || state.kind === 'loading') return;
    setState({ kind: 'loading' });
    try {
      let id = journeyId;
      if (!id) {
        id = (await createJourney()).id;
        setJourneyId(id);
      }
      const message = await sendMessage(id, souvenir);
      setTexteAnalyse(souvenir);
      setState({
        kind: 'done',
        analysis: message.analysis,
        model: message.model,
      });
    } catch (err) {
      // Parcours disparu (base remise à zéro) : on en créera un nouveau
      if (err instanceof ApiRequestError && err.status === 404) {
        setJourneyId(null);
      }
      const message = err instanceof Error ? err.message : String(err);
      setState({ kind: 'error', message });
    }
  }

  const premiereImage = IMAGES.find((i) => i.id === selection[0])?.src;

  return (
    <div className="app">
      <Header panier={auPanier ?? 0} />
      {ecran === 'raconter' && (
        <Raconter
          text={text}
          onTextChange={setText}
          state={state}
          perime={perime}
          onAnalyser={() => void analyser()}
          onSuivant={() => aller('explorer')}
        />
      )}
      {ecran === 'explorer' && (
        <Explorer
          selection={selection}
          onSelectionChange={setSelection}
          onRetour={() => aller('raconter')}
          onSuivant={() => aller('ressentir')}
        />
      )}
      {/* Ressentir et Projet : on n'y arrive qu'avec une analyse terminée
          (Suivant de Raconter) */}
      {ecran === 'ressentir' && state.kind === 'done' && (
        <Ressentir
          analysis={state.analysis}
          image={premiereImage}
          onRetour={() => aller('explorer')}
          onSuivant={() => aller('projet')}
        />
      )}
      {ecran === 'projet' && state.kind === 'done' && (
        <Projet
          analysis={state.analysis}
          reponses={projet}
          onReponsesChange={setProjet}
          image={premiereImage}
          onRetour={() => aller('ressentir')}
          onSuivant={allerAuxPistes}
        />
      )}
      {ecran === 'pistes' && state.kind === 'done' && (
        <Pistes
          signature={state.analysis.signature.nom}
          commande={commande}
          onCommandeChange={setCommande}
          auPanier={auPanier}
          onAjouter={() => setAuPanier(nombreEchantillons(commande))}
          onRetour={() => aller('projet')}
        />
      )}
    </div>
  );
}
