import { useEffect, useState } from 'react';

// Réponses de GET /api/health (openapi.yaml)
type HealthOk = { status: 'ok'; db: string };
type ApiError = { status: 'error'; error: string };

type State =
  | { kind: 'loading' }
  | { kind: 'ok'; db: string }
  | { kind: 'error'; message: string };

async function fetchHealth(signal: AbortSignal): Promise<State> {
  // Chemin relatif : le serveur Vite relaie /api vers l'API (vite.config.ts)
  const res = await fetch('/api/health', { signal });
  const body = (await res.json().catch(() => null)) as
    HealthOk | ApiError | null;
  if (res.ok && body?.status === 'ok') return { kind: 'ok', db: body.db };
  if (body?.status === 'error') return { kind: 'error', message: body.error };
  return {
    kind: 'error',
    message: `Réponse inattendue de l'API (HTTP ${res.status})`,
  };
}

export function App() {
  const [state, setState] = useState<State>({ kind: 'loading' });

  useEffect(() => {
    const controller = new AbortController();
    fetchHealth(controller.signal)
      .then(setState)
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        const message = err instanceof Error ? err.message : String(err);
        setState({ kind: 'error', message: `API injoignable : ${message}` });
      });
    return () => controller.abort();
  }, []);

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem' }}>
      <h1>Givaudan B2B</h1>
      {state.kind === 'loading' && <p>Connexion à l'API…</p>}
      {state.kind === 'ok' && (
        <>
          <p>API OK</p>
          <p>
            Base de données : <code>{state.db}</code>
          </p>
        </>
      )}
      {state.kind === 'error' && <p role="alert">Erreur : {state.message}</p>}
    </main>
  );
}
