import { Router } from 'express';
import { checkHealth } from './health.service.ts';

// HTTP uniquement : la logique et la base sont dans health.service.ts
export const healthRouter = Router();

// GET /api/health (openapi.yaml)
healthRouter.get('/health', async (_req, res) => {
  const health = await checkHealth();
  if (!health.ok) {
    res.status(503).json({ status: 'error', error: health.error });
    return;
  }
  res.json({ status: 'ok', db: health.db });
});
