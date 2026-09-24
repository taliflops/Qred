import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import type { Dashboard, CardStatus, Transaction } from './types.js';

type DatabaseState = Dashboard;

const initialState: DatabaseState = {
  companyName: 'Company AB', invoiceDue: true, cardStatus: 'inactive', spendUsed: 5400, spendLimit: 10000,
  transactions: [
    { id: 1, label: 'Transaction data', amount: 'Data points' },
    { id: 2, label: 'Transaction data', amount: 'Data points' },
    { id: 3, label: 'Transaction data', amount: 'Data points' }
  ], transactionCount: 57
};

export function createDatabase(filename = ':memory:'): DatabaseState {
  if (filename !== ':memory:' && existsSync(filename)) return JSON.parse(readFileSync(filename, 'utf8')) as DatabaseState;
  return structuredClone(initialState);
}

export class DashboardRepository {
  constructor(private readonly database: DatabaseState, private readonly filename = ':memory:') {}

  getDashboard(): Dashboard {
    return structuredClone(this.database);
  }

  setCardStatus(status: CardStatus): void {
    this.database.cardStatus = status;
    if (this.filename !== ':memory:') writeFileSync(this.filename, JSON.stringify(this.database, null, 2));
  }
}