import type { ErrorRequestHandler } from 'express';

// Erreur levée par express.json() sur un corps illisible : une faute du
// client (400), pas une erreur du serveur
function isJsonParseError(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    'type' in err &&
    err.type === 'entity.parse.failed'
  );
}

// Dernier middleware : reçoit toute erreur non traitée d'une route, y compris
// une promesse rejetée (Express 5 les transmet seul). Le détail reste dans
// les logs ; le client reçoit le format Error d'openapi.yaml.
export const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  // Réponse déjà commencée : Express doit couper la connexion lui-même
  if (res.headersSent) {
    console.error('[api] erreur non traitée :', err);
    next(err);
    return;
  }
  if (isJsonParseError(err)) {
    res
      .status(400)
      .json({ status: 'error', error: 'Corps de requête : JSON mal formé' });
    return;
  }
  console.error('[api] erreur non traitée :', err);
  res.status(500).json({ status: 'error', error: 'Erreur interne du serveur' });
};
