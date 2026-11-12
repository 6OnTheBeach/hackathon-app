import express from 'express';
import { errorHandler } from './middlewares/error-handler.ts';
import { healthRouter } from './modules/health/health.routes.ts';
import { journeysRouter } from './modules/journeys/journeys.routes.ts';

// Crée l'application sans la démarrer (voir server.ts)
export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json());

  // Un routeur par module, tous sous /api (servers.url d'openapi.yaml)
  app.use('/api', healthRouter);
  app.use('/api', journeysRouter);

  app.use(errorHandler);
  return app;
}
