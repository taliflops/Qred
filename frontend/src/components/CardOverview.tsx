import { Logo } from '../assets/icons';
import { useApi } from '../api/ApiContext';

export function CardOverview() {
  const { overview, isUpdating, setCardStatus } = useApi();
  const card = overview?.selectedAccount.card;

  if (!card) {
    return (
      <section className="card card--empty">
        <p>No card linked to this account</p>
      </section>
    );
  }

  const isActive = card.status === 'active';

  return (
    <section aria-label="Card">
      <div className="card">
        <div className="card__header">
          <Logo />
          <span className={`card__status card__status--${card.status}`}>{card.status}</span>
        </div>
        <p className="card__number">
          <span aria-hidden>••••</span> {card.last4}
        </p>
      </div>
      <button
        type="button"
        className="text-button"
        disabled={isUpdating}
        onClick={() => setCardStatus(card.id, isActive ? 'inactive' : 'active')}
      >
        {isActive ? 'Deactivate card' : 'Activate card'}
      </button>
    </section>
  );
}
