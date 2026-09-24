CREATE TYPE card_status AS ENUM ('active', 'inactive');

CREATE TABLE users (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  selected_account_id uuid,              -- FK added below (circular reference)
  created_at          timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE accounts (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name             text NOT NULL,
  currency         char(3) NOT NULL DEFAULT 'SEK',
  credit_limit     bigint NOT NULL CHECK (credit_limit >= 0),     -- minor units
  remaining        bigint NOT NULL CHECK (remaining <= credit_limit),
  created_at       timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, id)                   -- enables ownership-enforcing FK
);

ALTER TABLE users
  ADD CONSTRAINT users_selected_account_fk
  FOREIGN KEY (id, selected_account_id) REFERENCES accounts (user_id, id);

CREATE TABLE cards (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id  uuid NOT NULL UNIQUE REFERENCES accounts(id) ON DELETE CASCADE,
  last4       char(4) NOT NULL,
  status      card_status NOT NULL DEFAULT 'inactive',
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE transactions (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id   uuid NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  merchant     text NOT NULL,
  amount       bigint NOT NULL,           -- signed, minor units
  occurred_at  timestamptz NOT NULL
);

CREATE INDEX transactions_account_recent_idx
  ON transactions (account_id, occurred_at DESC);
