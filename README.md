# Qred mobile dashboard

A responsive React client and TypeScript service for the mobile dashboard shown in the reference
image. The implementation keeps the dashboard deliberately focused: account summary, invoice/card
status, remaining spend, recent transactions, and support actions.

## Setup

Requirements: Node.js 20+ and npm 10+.

```bash
npm install
npm run dev
```

The client runs at `http://localhost:5173` and the API at `http://localhost:4000`.

Useful commands:

```bash
npm test   # backend unit and integration tests
npm run build
```

## Architecture

The repository is an npm workspace with two services:

```text
frontend/  React + Vite client
backend/   Express API + file-backed persistence
```

The backend is event-driven at its application boundary. HTTP commands call the dashboard service,
which writes through the SQLite repository and emits domain events through an in-process event bus.
Read endpoints query the repository directly. This keeps commands, persistence, and side effects
separate while remaining small enough for a single deployable service.

```text
React UI -> REST API -> DashboardService -> EventBus
                         |                 |
                         v                 v
                     database          subscribers
```

The client loads its initial state from the API and reacts to commands such as card activation
without coupling UI state to database details.
