import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from './app.js';

describe('dashboard API', () => {
  it('returns the mobile dashboard read model', async () => {
    const { app } = createApp();
    const response = await request(app).get('/api/dashboard');
    expect(response.status).toBe(200);
    expect(response.body.companyName).toBe('Company AB');
    expect(response.body.transactions).toHaveLength(3);
  });

  it('handles the activation command', async () => {
    const { app } = createApp();
    const response = await request(app).post('/api/card/activate');
    expect(response.status).toBe(200);
    expect(response.body.cardStatus).toBe('active');
  });
});