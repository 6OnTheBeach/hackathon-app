import type { ErrorRequestHandler } from 'express';

// Dernier middleware : reçoit toute erreur non traitée d'une route, y compris
// une promesse rejetée (Express 5 les transmet seul). Le détail reste dans
// les logs ; le client reçoit le format Error d'openapi.yaml.
export const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  console.error('[api] erreur non traitée :', err);
  // Réponse déjà commencée : Express doit couper la connexion lui-même
  if (res.headersSent) {
    next(err);
    return;
  }
  res.status(500).json({ status: 'error', error: 'Erreur interne du serveur' });
};
