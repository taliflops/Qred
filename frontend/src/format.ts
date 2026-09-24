import type { CurrencyCode, ISODateString, Money } from './types';

const CURRENCY_SUFFIX: Record<CurrencyCode, string> = { SEK: 'kr', NOK: 'kr', DKK: 'kr', EUR: '€' };

/** Major units without grouping, matching the design ("5400", "-48"). */
export const formatAmount = ({ amount }: Money) =>
  amount % 100 === 0 ? String(amount / 100) : (amount / 100).toFixed(2);

export const formatMoney = (money: Money) => `${formatAmount(money)} ${CURRENCY_SUFFIX[money.currency]}`;

export const currencySuffix = (currency: CurrencyCode) => CURRENCY_SUFFIX[currency];

export const formatDate = (date: ISODateString) =>
  new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
