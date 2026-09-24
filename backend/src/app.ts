import express, { type NextFunction, type Request, type Response } from 'express';
import cors from 'cors';
import type { OverviewRepository } from './repository.js';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function createApp(repository: OverviewRepository) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // Malformed ids can't match any row; reject them before they reach Postgres.
  for (const param of ['userId', 'cardId', 'accountId']) {
    app.param(param, (_req: Request, res: Response, next: NextFunction, value: string) => {
      if (UUID.test(value)) next();
      else res.status(404).json({ error: 'Not found' });
    });
  }

  const sendOverview = async (res: Response, userId: string) => {
    const overview = await repository.getOverview(userId);
    if (overview) res.json(overview);
    else res.status(404).json({ error: 'User not found' });
  };

  app.get('/user/:userId', async (req, res) => {
    await sendOverview(res, req.params.userId);
  });

  app.patch('/user/:userId/card/:cardId', async (req, res) => {
    const { status } = req.body ?? {};
    if (status !== 'active' && status !== 'inactive') {
      res.status(400).json({ error: 'status must be "active" or "inactive"' });
      return;
    }
    const updated = await repository.setCardStatus(req.params.userId, req.params.cardId, status);
    if (!updated) {
      res.status(404).json({ error: 'Card not found' });
      return;
    }
    await sendOverview(res, req.params.userId);
  });

  app.post('/user/:userId/account/:accountId', async (req, res) => {
    const selected = await repository.selectAccount(req.params.userId, req.params.accountId);
    if (!selected) {
      res.status(404).json({ error: 'Account not found' });
      return;
    }
    await sendOverview(res, req.params.userId);
  });

  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}
