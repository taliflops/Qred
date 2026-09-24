import express from 'express';
import cors from 'cors';
import { createDatabase, DashboardRepository } from './database.js';
import { EventBus } from './events.js';
import { DashboardService } from './service.js';

export function createApp(databaseFilename = ':memory:') {
  const app = express();
  const repository = new DashboardRepository(createDatabase(databaseFilename), databaseFilename);
  const events = new EventBus();
  const service = new DashboardService(repository, events);
  app.use(cors());
  app.use(express.json());
  app.get('/api/health', (_request, response) => response.json({ status: 'ok' }));
  app.get('/api/dashboard', (_request, response) => response.json(service.getDashboard()));
  app.post('/api/card/activate', (_request, response) => response.status(200).json(service.activateCard()));
  return { app, service, events };
}