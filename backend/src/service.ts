import type { Dashboard } from './types.js';
import { DashboardRepository } from './database.js';
import { EventBus } from './events.js';

export class DashboardService {
  constructor(private readonly repository: DashboardRepository, private readonly events: EventBus) {}

  getDashboard(): Dashboard {
    return this.repository.getDashboard();
  }

  activateCard(): Dashboard {
    this.repository.setCardStatus('active');
    this.events.publish({ type: 'CardActivated', occurredAt: new Date().toISOString() });
    return this.repository.getDashboard();
  }
}