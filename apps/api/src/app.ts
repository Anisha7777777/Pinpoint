import express from 'express';
import { healthRouter } from './features/health/health.routes.js';

export const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '100kb' }));
app.use('/api/health', healthRouter);
app.use((_req, res) => { res.status(404).json({ error: 'Route not found' }); });
app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (error instanceof SyntaxError) {
    res.status(400).json({ error: 'Invalid JSON body' });
    return;
  }
  if (typeof error === 'object' && error !== null && 'status' in error && error.status === 413) {
    res.status(413).json({ error: 'Request body too large' });
    return;
  }
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
});
