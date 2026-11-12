import { Router } from 'express';
import { addMessage, createJourney } from './journeys.service.ts';

// HTTP uniquement : la logique et la base sont dans journeys.service.ts
export const journeysRouter = Router();

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_TEXT_LENGTH = 5000;

// POST /api/journeys (openapi.yaml)
journeysRouter.post('/journeys', async (_req, res) => {
  const journey = await createJourney();
  res.status(201).json(journey);
});

// POST /api/journeys/{id}/messages (openapi.yaml)
journeysRouter.post('/journeys/:id/messages', async (req, res) => {
  const { id } = req.params;
  if (!UUID.test(id)) {
    res
      .status(400)
      .json({ status: 'error', error: 'Identifiant de parcours invalide' });
    return;
  }

  const raw: unknown = req.body?.text;
  const text = typeof raw === 'string' ? raw.trim() : '';
  if (text === '') {
    res.status(400).json({
      status: 'error',
      error: 'Le champ « text » est obligatoire et ne peut pas être vide',
    });
    return;
  }
  if (text.length > MAX_TEXT_LENGTH) {
    res.status(400).json({
      status: 'error',
      error: `Le souvenir dépasse ${MAX_TEXT_LENGTH} caractères`,
    });
    return;
  }

  const result = await addMessage(id, text);
  if (!result.ok) {
    if (result.reason === 'journey_not_found') {
      res.status(404).json({ status: 'error', error: 'Parcours inconnu' });
    } else {
      res.status(502).json({ status: 'error', error: result.error });
    }
    return;
  }
  res.status(201).json(result.message);
});
