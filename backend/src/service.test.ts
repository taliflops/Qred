import { describe, expect, it } from 'vitest';
import { createDatabase, DashboardRepository } from './database.js';
import { EventBus } from './events.js';
import { DashboardService } from './service.js';

describe('DashboardService', () => {
  it('activates a card, persists it, and emits a domain event', () => {
    const events = new EventBus();
    const service = new DashboardService(new DashboardRepository(createDatabase()), events);
    let eventReceived = false;
    events.subscribe('CardActivated', () => { eventReceived = true; });

    const result = service.activateCard();

    expect(result.cardStatus).toBe('active');
    expect(service.getDashboard().cardStatus).toBe('active');
    expect(eventReceived).toBe(true);
  });
});