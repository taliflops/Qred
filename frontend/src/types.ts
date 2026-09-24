export type ISODateString = string;   // "2026-09-25T14:32:00Z"
export type CurrencyCode = "SEK" | "EUR" | "NOK" | "DKK"; // ISO 4217

export interface Money {
  amount: number;              // integer, minor units (öre) → 540000 = 5400 kr
  currency: CurrencyCode;
}

export interface AccountSummary {     // dropdown options
  id: string;
  name: string;                // "Nordic Bygg"
}

export type CardStatus = "active" | "inactive";

export interface Card {
  id: string;
  last4: string;               // string, preserves leading zeros ("0042")
  status: CardStatus;
  brandImageUrl: string;       // card header logo
}

export interface Balance {
  remaining: Money;
  limit: Money;
}

export interface Transaction {
  id: string;
  merchant: string;            // "Circle K"
  amount: Money;               // negative for debits: -4800
  date: ISODateString;
}

export interface OverviewResponse {
  user: { id: string };
  accounts: AccountSummary[];  // all accounts, for the dropdown
  selectedAccount: {
    id: string;
    name: string;
    card: Card | null;         // null if the account has no card
    balance: Balance;
    latestTransactions: Transaction[]; // max 3, sorted by date desc
  };
}
