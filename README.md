# Qred overview

A mobile-first dashboard for a Qred business card customer. The user can switch between their
company accounts, see the card and whether it is active, check remaining spend against the credit
limit, and view their latest transactions. It is a React client backed by a small Express API over
Postgres.

## Setup

Requirements: Node.js 22+ and npm.

```bash
npm install   # installs both workspaces
npm run dev   # starts the API and the web client together
```

- Web client: http://localhost:5173
- API: http://localhost:3001 (set `PORT` to change it)

No database server is needed. The API runs an in-memory Postgres ([PGlite](https://pglite.dev)) and
loads the schema and seed data at startup, so data resets every time the API restarts.

Other commands:

```bash
npm test        # backend API tests (Vitest + Supertest)
npm run build   # compile backend to backend/dist, bundle frontend to frontend/dist
npm start -w backend   # run the compiled API
```

## Architecture

This is an npm workspace with two packages:

```text
backend/    Express 5 API, PGlite (Postgres), TypeScript
frontend/   React 19 + Vite client
assets/     Design reference: interface mock, example data shape and SQL
```

```text
 React components ──useApi()──▶ ApiProvider ──fetch /api/*──▶ Vite dev proxy
                                                                    │
                                                          strips /api prefix
                                                                    ▼
                         PGlite ◀── OverviewRepository ◀── Express routes (app.ts)
```

### Backend

| File            | Role                                                                                                                              |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `server.ts`     | Entry point. Creates the database and starts the HTTP server.                                                                     |
| `app.ts`        | Express app factory: routes, UUID validation of path params, error handler. It takes a repository, so tests can inject their own. |
| `repository.ts` | All SQL. A single query builds the full overview as JSON inside Postgres.                                                         |
| `database.ts`   | Creates the in-memory PGlite instance and runs `schema.sql` and `seed.sql`.                                                       |
| `types.ts`      | The response contract (`OverviewResponse`).                                                                                       |

### API

Every endpoint returns the full `OverviewResponse`, so the client never needs to merge partial
updates:

| Method  | Path                               | Effect                                                         |
| ------- | ---------------------------------- | -------------------------------------------------------------- |
| `GET`   | `/user/:userId`                    | Returns the overview for the user's selected account           |
| `PATCH` | `/user/:userId/card/:cardId`       | Sets card status. Body: `{ "status": "active" \| "inactive" }` |
| `POST`  | `/user/:userId/account/:accountId` | Changes the selected account                                   |

Malformed IDs and resources the user doesn't own both return `404`.

**Data model** (`schema.sql`): `users` → `accounts` → `cards` (one per account) and `transactions`.
Some notes:

- Money is stored as `bigint` minor units (öre) with a currency code, and the API sends it the same
  way. Formatting happens only in the client (`frontend/src/format.ts`).
- `users.selected_account_id` has a composite foreign key on `(user_id, id)`, so a user can only
  select an account they own.
- Only the three latest transactions are returned, backed by an index on
  `(account_id, occurred_at DESC)`.

### Frontend

- `api/ApiContext.tsx`: `ApiProvider` owns all server state (`overview`, `error`, `isUpdating`) and
  exposes the actions `selectAccount` and `setCardStatus`. Each action replaces `overview` with the
  server's response.
- `components/`: one component per dashboard section (`Header`, `AccountSelector`, `CardOverview`,
  `AccountOverview`, `TransactionsOverview`, `ContactSupportButton`). Each reads what it needs
  through `useApi()`.
- `format.ts`: currency and date formatting.
- `types.ts`: a copy of the API contract.
