import { beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from './app.js';
import { createDatabase } from './database.js';
import { OverviewRepository } from './repository.js';

const USER = '00000000-0000-0000-0000-000000000001';
const ACC_1 = '00000000-0000-0000-0000-0000000000a1';
const ACC_2 = '00000000-0000-0000-0000-0000000000a2';
const CARD_1 = '00000000-0000-0000-0000-0000000000c1';

let app: ReturnType<typeof createApp>;
beforeEach(async () => {
  app = createApp(new OverviewRepository(await createDatabase()));
});

describe('GET /user/:userId', () => {
  it('returns the overview for the selected account', async () => {
    const res = await request(app).get(`/user/${USER}`).expect(200);
    expect(res.body.accounts).toEqual([
      { id: ACC_1, name: 'Nordic Bygg' },
      { id: ACC_2, name: 'Stockholm Måleri' },
    ]);
    expect(res.body.selectedAccount).toMatchObject({
      id: ACC_1,
      card: { id: CARD_1, last4: '1234', status: 'inactive' },
      balance: { remaining: { amount: 540000, currency: 'SEK' }, limit: { amount: 1000000, currency: 'SEK' } },
    });
    const txs = res.body.selectedAccount.latestTransactions;
    expect(txs.map((t: { merchant: string }) => t.merchant)).toEqual(['Circle K', 'Clas Ohlson', 'Adobe']);
    expect(txs[0]).toMatchObject({ amount: { amount: -4800, currency: 'SEK' }, date: '2026-09-25T10:12:00Z' });
  });

  it('404s for unknown or malformed user ids', async () => {
    await request(app).get('/user/00000000-0000-0000-0000-00000000ffff').expect(404);
    await request(app).get('/user/nope').expect(404);
  });
});

describe('PATCH /user/:userId/card/:cardId', () => {
  it('sets the card status', async () => {
    const res = await request(app).patch(`/user/${USER}/card/${CARD_1}`).send({ status: 'active' }).expect(200);
    expect(res.body.selectedAccount.card.status).toBe('active');
  });

  it('rejects invalid statuses', async () => {
    await request(app).patch(`/user/${USER}/card/${CARD_1}`).send({ status: 'blocked' }).expect(400);
  });
});

describe('POST /user/:userId/account/:accountId', () => {
  it('changes the selected account', async () => {
    const res = await request(app).post(`/user/${USER}/account/${ACC_2}`).expect(200);
    expect(res.body.selectedAccount).toMatchObject({ id: ACC_2, name: 'Stockholm Måleri', card: { last4: '0042' } });
    await request(app).get(`/user/${USER}`).expect(200).expect((r) => expect(r.body.selectedAccount.id).toBe(ACC_2));
  });

  it('404s for an account the user does not own', async () => {
    await request(app).post(`/user/${USER}/account/00000000-0000-0000-0000-0000000000ff`).expect(404);
  });
});
