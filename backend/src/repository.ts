import type { PGlite } from '@electric-sql/pglite';
import type { CardStatus, OverviewResponse } from './types.js';

const BRAND_IMAGE_URL = '/assets/qred-logo.svg';

// bigint columns are cast to int so amounts come back as JSON numbers.
const OVERVIEW_QUERY = `
SELECT json_build_object(
  'user', json_build_object('id', u.id),
  'accounts', COALESCE((
    SELECT json_agg(json_build_object('id', a.id, 'name', a.name) ORDER BY a.created_at)
    FROM accounts a WHERE a.user_id = u.id
  ), '[]'::json),
  'selectedAccount', (
    SELECT json_build_object(
      'id', a.id,
      'name', a.name,
      'card', (SELECT json_build_object('id', c.id, 'last4', c.last4, 'status', c.status, 'brandImageUrl', $2::text)
               FROM cards c WHERE c.account_id = a.id),
      'balance', json_build_object(
        'remaining', json_build_object('amount', a.remaining::int8, 'currency', a.currency),
        'limit',     json_build_object('amount', a.credit_limit::int8, 'currency', a.currency)),
      'latestTransactions', COALESCE((
        SELECT json_agg(json_build_object(
                 'id', t.id, 'merchant', t.merchant,
                 'amount', json_build_object('amount', t.amount, 'currency', a.currency),
                 'date', to_char(t.occurred_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'))
                 ORDER BY t.occurred_at DESC)
        FROM (SELECT * FROM transactions
              WHERE account_id = a.id
              ORDER BY occurred_at DESC LIMIT 3) t
      ), '[]'::json)
    )
    FROM accounts a WHERE a.id = u.selected_account_id
  )
) AS overview
FROM users u
WHERE u.id = $1`;

export class OverviewRepository {
  constructor(private readonly db: PGlite) {}

  async getOverview(userId: string): Promise<OverviewResponse | null> {
    const { rows } = await this.db.query<{ overview: OverviewResponse }>(OVERVIEW_QUERY, [userId, BRAND_IMAGE_URL]);
    return rows[0]?.overview ?? null;
  }

  /** Returns false if the card doesn't exist or isn't owned by the user. */
  async setCardStatus(userId: string, cardId: string, status: CardStatus): Promise<boolean> {
    const { rows } = await this.db.query(
      `UPDATE cards c SET status = $3::card_status, updated_at = now()
       FROM accounts a
       WHERE c.id = $2 AND c.account_id = a.id AND a.user_id = $1
       RETURNING c.id`,
      [userId, cardId, status],
    );
    return rows.length > 0;
  }

  /** Returns false if the account doesn't exist or isn't owned by the user. */
  async selectAccount(userId: string, accountId: string): Promise<boolean> {
    const { rows } = await this.db.query(
      `UPDATE users u SET selected_account_id = a.id
       FROM accounts a
       WHERE u.id = $1 AND a.id = $2 AND a.user_id = u.id
       RETURNING u.id`,
      [userId, accountId],
    );
    return rows.length > 0;
  }
}
