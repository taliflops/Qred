import { useApi } from './api/ApiContext';
import { AccountOverview } from './components/AccountOverview';
import { AccountSelector } from './components/AccountSelector';
import { CardOverview } from './components/CardOverview';
import { ContactSupportButton } from './components/ContactSupportButton';
import { Header } from './components/Header';
import { TransactionsOverview } from './components/TransactionsOverview';

export function App() {
  const { overview, error } = useApi();

  return (
    <div className="app">
      <Header />
      {error && <p className="error" role="alert">{error}</p>}
      {overview ? (
        <main className="overview">
          <AccountSelector />
          <CardOverview />
          <AccountOverview />
          <TransactionsOverview />
          <ContactSupportButton />
        </main>
      ) : (
        !error && <p className="loading">Loading…</p>
      )}
    </div>
  );
}
