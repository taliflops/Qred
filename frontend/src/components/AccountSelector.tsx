import { ArrowRight } from '../assets/icons';
import { useApi } from '../api/ApiContext';

export function AccountSelector() {
  const { overview, isUpdating, selectAccount } = useApi();
  if (!overview) return null;
  const { selectedAccount, accounts } = overview;

  // The native select sits transparently over the label so the chevron hugs the selected name.
  return (
    <div className="account-selector">
      <span className="account-selector__label" aria-hidden>
        {selectedAccount.name}
        <span className="account-selector__chevron">
          <ArrowRight color="#ffffff80" />
        </span>
      </span>
      <select
        aria-label="Account"
        value={selectedAccount.id}
        disabled={isUpdating}
        onChange={(e) => selectAccount(e.target.value)}
      >
        {accounts.map((account) => (
          <option key={account.id} value={account.id}>
            {account.name}
          </option>
        ))}
      </select>
    </div>
  );
}
