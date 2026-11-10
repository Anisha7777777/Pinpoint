import { Router } from 'express';

export const healthRouter = Router();
// Liveness only: no database or storage dependency is connected in Phase 1.
healthRouter.get('/', (_req, res) => {
  res.json({ status: 'ok', service: 'pinpoint-api' });
});
