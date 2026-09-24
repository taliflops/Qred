# Backend service

The backend exposes the dashboard query and command API.

## Features

- File-backed account, card, spend, and transaction data.
- `GET /api/dashboard` for the mobile dashboard read model.
- `POST /api/card/activate` for the card activation command.
- Event bus with `CardActivated` domain events.
- Unit tests for the service and integration tests for the HTTP API.

## Run

```bash
npm install
npm run dev
```

Set `PORT` or `DATABASE_PATH` to override the defaults. Tests use an in-memory database.
