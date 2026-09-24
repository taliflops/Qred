import { ArrowRight } from '../assets/icons';
import { useApi } from '../api/ApiContext';
import { currencySuffix, formatAmount } from '../format';

export function AccountOverview() {
  const { overview } = useApi();
  if (!overview) return null;
  const { remaining, limit } = overview.selectedAccount.balance;

  // Navigation to the account overview page is out of scope; only the chevron is shown.
  return (
    <section className="balance" aria-label="Account overview">
      <h2 className="balance__label">Remaining</h2>
      <button type="button" className="balance__row" aria-label="Open account overview">
        <span className="balance__remaining">{formatAmount(remaining)}</span>
        <span className="balance__limit">
          /{formatAmount(limit)} {currencySuffix(limit.currency)}
        </span>
        <ArrowRight />
      </button>
    </section>
  );
}
