type ISODateString = string;
type CurrencyCode = 'SEK' | 'EUR' | 'NOK' | 'DKK';

export interface Money {
  amount: number; // integer, minor units
  currency: CurrencyCode;
}

export type CardStatus = 'active' | 'inactive';

export interface Card {
  id: string;
  last4: string;
  status: CardStatus;
  brandImageUrl: string;
}

export interface Transaction {
  id: string;
  merchant: string;
  amount: Money;
  date: ISODateString;
}

export interface OverviewResponse {
  user: { id: string };
  accounts: { id: string; name: string }[];
  selectedAccount: {
    id: string;
    name: string;
    card: Card | null;
    balance: { remaining: Money; limit: Money };
    latestTransactions: Transaction[];
  } | null;
}
