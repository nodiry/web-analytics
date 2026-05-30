# server

Elysia.js REST API for the Glasscube Analytics dashboard.

See root README.md for full documentation.

## Quick start
```bash
bun install
bun run dev
```

## Environment variables
Copy `.env.example` to `.env` and fill in values:
- `DB` — MongoDB connection string
- `SAUCE` — JWT secret (any random string)
- `PORT` — Server port (default 3003)
- `EMAIL` — Resend API key
- `GOOGLE_CLIENT_ID` — Google OAuth client ID
- `ORIGIN` — Allowed CORS origin (your frontend URL)
