import { useEffect, useState } from 'react';

type Dashboard = { companyName: string; invoiceDue: boolean; cardStatus: 'inactive' | 'active'; spendUsed: number; spendLimit: number; transactions: { id: number; label: string; amount: string }[]; transactionCount: number };
const api = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

export function App() {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => { fetch(`${api}/api/dashboard`).then((response) => response.json()).then(setDashboard).catch(() => setMessage('Unable to load your dashboard.')); }, []);
  if (!dashboard) return <main className="shell loading">{message || 'Loading dashboard...'}</main>;
  const remaining = dashboard.spendLimit - dashboard.spendUsed;
  const activateCard = async () => { const response = await fetch(`${api}/api/card/activate`, { method: 'POST' }); setDashboard(await response.json()); setMessage('Card activated'); };

  return <main className="shell">
    <header className="topbar"><img src="/logo.svg" alt="Qred" className="logo" /><button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen}>Menu <span className="menu-lines">&#9776;</span></button></header>
    {menuOpen && <nav className="menu-panel"><button onClick={() => setMenuOpen(false)}>Dashboard</button><button onClick={() => setMessage('Profile is managed by your administrator.')}>Profile</button><button onClick={() => setMessage('Signed out locally.')}>Sign out</button></nav>}
    <section className="company-picker"><button onClick={() => setCompanyOpen(!companyOpen)} aria-expanded={companyOpen}><span>{dashboard.companyName}</span><span className="chevron">⌄</span></button>{companyOpen && <div className="company-options"><button onClick={() => setCompanyOpen(false)}>Company AB</button></div>}</section>
    <section className="status-card"><button className="status-label" onClick={() => setMessage('Invoice details are coming soon.')}>Invoice due <span>›</span></button><button className="card-link" onClick={() => setMessage(dashboard.cardStatus === 'active' ? 'Your card is active.' : 'Activate your card below.')}>Card image <span>›</span></button></section>
    <section className="spend-panel"><h2>Remaining spend</h2><button className="spend-value" onClick={() => setMessage('Spend details are coming soon.')}>{remaining.toLocaleString('sv-SE')} / {dashboard.spendLimit.toLocaleString('sv-SE')} kr <span>›</span></button><p>based on your set limit</p></section>
    <section className="transactions"><h2>Latest transactions</h2><div className="transaction-list">{dashboard.transactions.map((transaction) => <div className="transaction" key={transaction.id}><span>{transaction.label}</span><span>{transaction.amount}</span></div>)}</div><button className="all-transactions" onClick={() => setMessage(`${dashboard.transactionCount - dashboard.transactions.length} more items in transaction view`)}>{dashboard.transactionCount - dashboard.transactions.length} more items in transaction view <span>›</span></button></section>
    <div className="actions"><button onClick={activateCard} disabled={dashboard.cardStatus === 'active'}>{dashboard.cardStatus === 'active' ? 'Card active' : 'Activate card'}</button><button onClick={() => setMessage('Support request started.')}>Contact Qred's support</button></div>
    {message && <div className="toast" role="status">{message}<button onClick={() => setMessage('')}>×</button></div>}
  </main>;
}