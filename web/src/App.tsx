import { useState, type FormEvent } from 'react';
import {
  ApiRequestError,
  createJourney,
  sendMessage,
  type Analysis,
  type ProfilNote,
} from './api.ts';

type State =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'done'; analysis: Analysis }
  | { kind: 'error'; message: string };

export function App() {
  const [text, setText] = useState('');
  // Le parcours est créé au premier envoi, puis réutilisé
  const [journeyId, setJourneyId] = useState<string | null>(null);
  const [state, setState] = useState<State>({ kind: 'idle' });

  const loading = state.kind === 'loading';

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const souvenir = text.trim();
    if (souvenir === '' || loading) return;

    setState({ kind: 'loading' });
    try {
      let id = journeyId;
      if (!id) {
        id = (await createJourney()).id;
        setJourneyId(id);
      }
      const message = await sendMessage(id, souvenir);
      setState({ kind: 'done', analysis: message.analysis });
    } catch (err) {
      // Parcours disparu (base remise à zéro) : on en créera un nouveau
      if (err instanceof ApiRequestError && err.status === 404) {
        setJourneyId(null);
      }
      const message = err instanceof Error ? err.message : String(err);
      setState({ kind: 'error', message });
    }
  }

  return (
    <main className="page">
      <header>
        <p className="eyebrow">Givaudan · Scent Journey</p>
        <h1>Racontez un souvenir</h1>
        <p className="muted">
          Un lieu, un moment, une émotion : l'IA en tire une signature
          olfactive.
        </p>
      </header>

      <form className="card" onSubmit={onSubmit}>
        <label htmlFor="souvenir" className="sr-only">
          Votre souvenir
        </label>
        <textarea
          id="souvenir"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Par exemple : une forêt tropicale juste après l'averse, la terre humide…"
          rows={5}
          maxLength={5000}
          disabled={loading}
        />
        <div className="actions">
          <button type="submit" disabled={loading || text.trim() === ''}>
            Envoyer
          </button>
        </div>
      </form>

      {loading && (
        <p className="status" role="status">
          <span className="spinner" aria-hidden="true" />
          L'IA analyse votre souvenir…
        </p>
      )}
      {state.kind === 'error' && (
        <p className="card error" role="alert">
          {state.message}
        </p>
      )}
      {state.kind === 'done' && <Result analysis={state.analysis} />}
    </main>
  );
}

function Result({ analysis }: { analysis: Analysis }) {
  const { comprehension: c, signature, roue, profil } = analysis;
  return (
    <>
      <section className="card">
        <h2>Signature</h2>
        <p className="signature">{signature.nom}</p>
        <p>{signature.description}</p>
      </section>

      <section className="card">
        <h2>Compréhension</h2>
        <dl className="facts">
          <dt>Lieu</dt>
          <dd>{c.lieu || '—'}</dd>
          <dt>Moment</dt>
          <dd>{c.moment || '—'}</dd>
          <dt>Météo</dt>
          <dd>{c.meteo || '—'}</dd>
          <dt>Émotion</dt>
          <dd>{c.emotion || '—'}</dd>
        </dl>
        {c.elements.length > 0 && (
          <ul className="tags">
            {c.elements.map((el) => (
              <li key={el}>{el}</li>
            ))}
          </ul>
        )}
      </section>

      <section className="card">
        <h2>Roue olfactive</h2>
        <ul className="bars">
          {roue.map(({ famille, pourcentage }) => (
            <li key={famille}>
              <span className="bar-label">{famille}</span>
              <span className="bar-track">
                <span
                  className="bar-fill"
                  style={{
                    width: `${Math.min(100, Math.max(0, pourcentage))}%`,
                  }}
                />
              </span>
              <span className="bar-value">{pourcentage} %</span>
            </li>
          ))}
        </ul>
      </section>

      {profil && (
        <section className="card">
          <h2>Profil</h2>
          <div className="profil">
            <Notes title="Tête" notes={profil.tete} />
            <Notes title="Cœur" notes={profil.coeur} />
            <Notes title="Fond" notes={profil.fond} />
          </div>
        </section>
      )}
    </>
  );
}

function Notes({ title, notes }: { title: string; notes: ProfilNote[] }) {
  return (
    <div>
      <h3>{title}</h3>
      {notes.length === 0 ? (
        <p className="muted">—</p>
      ) : (
        <ul className="notes">
          {notes.map((n, i) => (
            <li key={`${n.ingredient}-${i}`}>
              <strong>{n.ingredient}</strong>
              {n.reference && <span className="ref"> · {n.reference}</span>}
              {n.raison && <p className="muted">{n.raison}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
