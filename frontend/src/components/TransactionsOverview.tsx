import { ArrowRight } from '../assets/icons';
import { useApi } from '../api/ApiContext';
import { formatDate, formatMoney } from '../format';

export function TransactionsOverview() {
  const { overview } = useApi();
  if (!overview) return null;
  const transactions = overview.selectedAccount.latestTransactions;

  // Navigation to the transactions page is out of scope; only the chevron is shown.
  return (
    <section className="transactions" aria-label="Latest transactions">
      <button type="button" className="transactions__header">
        <h2>Latest transactions</h2>
        <ArrowRight color="#000000" />
      </button>
      {transactions.length === 0 ? (
        <p className="transactions__empty">No transactions yet</p>
      ) : (
        <ul>
          {transactions.map((tx) => (
            <li key={tx.id} className="transaction">
              <div>
                <p className="transaction__merchant">{tx.merchant}</p>
                <time className="transaction__date" dateTime={tx.date}>
                  {formatDate(tx.date)}
                </time>
              </div>
              <p className="transaction__amount">{formatMoney(tx.amount)}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
