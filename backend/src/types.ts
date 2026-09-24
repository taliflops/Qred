export type CardStatus = 'inactive' | 'active';

export interface Transaction {
  id: number;
  label: string;
  amount: string;
}

export interface Dashboard {
  companyName: string;
  invoiceDue: boolean;
  cardStatus: CardStatus;
  spendUsed: number;
  spendLimit: number;
  transactions: Transaction[];
  transactionCount: number;
}