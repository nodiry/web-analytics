# Glasscube Analytics

Open-source, self-hostable web analytics platform. Drop one script tag into your website and get a full analytics dashboard — page views, sessions, bounce rate, geo distribution, device breakdown, referrers, and more.

---

## Architecture

```
analytics/
├── traffic/       Bun HTTP server — receives tracking beacons from websites
├── server/        Elysia.js API server — serves the dashboard frontend
├── mobile/        Elysia.js API server — mobile-optimized variant (port 3062)
└── client/        React/Vite frontend — the analytics dashboard UI
```

### Data flow

```
User visits tracked site
       ↓
Script fires navigator.sendBeacon → POST https://track.glasscube.io/:uniqueKey
       ↓
traffic/ server stores raw event in MongoDB (Track collection)
       ↓
Every 15 minutes: cron job in server/ aggregates Track → Metric documents
       ↓
Dashboard user fetches GET /metric/:userId/:uniqueKey/:period
       ↓
Charts & stats rendered in client/
```

---

## Services

### traffic/ — Tracking beacon receiver

Bun native HTTP server. Accepts `POST /:uniqueKey` with JSON body from the embed script. Resolves IP to country using MaxMind GeoLite2. Stores raw events in MongoDB `tracks` collection.

**Port:** `3001` (configurable via `PORT` env)

**Required env:**
```
DB=mongodb://...
PORT=3001
```

**Start:**
```bash
cd traffic && bun run dev
```

> Requires `geoip.mmdb` (MaxMind GeoLite2 City database) at the project root.

---

### server/ — Dashboard API (Elysia.js)

Elysia.js + Mongoose REST API powering the analytics dashboard. Handles auth (email/password + Google OAuth), website CRUD, and metric queries. Includes a cron job that aggregates raw tracking data into metric snapshots every 15 minutes.

**Port:** `3003` (configurable via `PORT` env)

**Required env:**
```
DB=mongodb://...
SAUCE=your_jwt_secret
PORT=3003
EMAIL=your_resend_api_key
GOOGLE_CLIENT_ID=your_google_client_id
ORIGIN=https://your-frontend-domain.com
```

**Routes:**
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /auth/signup | — | Register with email |
| POST | /auth/signin | — | Sign in with email |
| POST | /auth/google/signup | — | Register with Google |
| POST | /auth/google/signin | — | Sign in with Google |
| POST | /auth/twoauth | — | Verify 2FA OTP |
| POST | /auth/forgot | — | Request password reset |
| PUT | /auth/user | ✓ | Update profile |
| DELETE | /auth/user | ✓ | Delete account |
| POST | /auth/logout | ✓ | Sign out |
| GET | /web/ | ✓ | List websites |
| POST | /web/ | ✓ | Add website |
| PUT | /web/ | ✓ | Update website |
| DELETE | /web/ | ✓ | Remove website |
| PUT | /web/renew | ✓ | Recompute website stats |
| GET | /metric/:userId/:key/:period | ✓ | Fetch metrics (1=24h, 2=7d, 3=30d, 4=all) |

**Start:**
```bash
cd server && bun install && bun run dev
```

---

### mobile/ — Mobile API (Elysia.js)

Same as `server/` but with open CORS (for mobile clients). Runs on port 3062.

```bash
cd mobile && bun install && bun run dev
```

---

### client/ — Dashboard UI (React + Vite)

React 19, Vite, Tailwind CSS v4, shadcn/ui, Framer Motion.

**Routes:**
- `/` — Landing page
- `/auth/signin` — Sign in
- `/auth/signup` — Sign up
- `/auth/twoauth` — Two-factor auth
- `/dashboard` — Website list
- `/metrics/:uniqueKey/:period` — Analytics for a specific website
- `/profile` — User profile

**Config:** Edit `src/siteConfig.ts` to point to your deployed server URL.

**Start:**
```bash
cd client && bun install && bun run dev
```

---

## Embed script

Add this to your website's `<head>` or before `</body>`:

```html
<script>
(function () {
  const server = "https://track.glasscube.io/YOUR_UNIQUE_KEY";
  const getSessionId = () => {
    const id = localStorage.getItem("session_id");
    if (id) return id;
    const newId = "sess-" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("session_id", newId);
    return newId;
  };
  const getDeviceType = () =>
    /Mobi|Android/i.test(navigator.userAgent) ? "mobile" :
    /Tablet|iPad/i.test(navigator.userAgent) ? "tablet" : "desktop";
  const send = () => {
    navigator.sendBeacon(server, JSON.stringify({
      url: window.location.href,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      loadTime: performance.now(),
      session_id: getSessionId(),
      deviceType: getDeviceType(),
    }));
  };
  if (document.readyState === "complete") send();
  else window.addEventListener("load", send);
})();
</script>
```

Replace `YOUR_UNIQUE_KEY` with the key shown in your dashboard after adding a website.

---

## Self-hosting

1. Clone the repo
2. Set up MongoDB (Atlas free tier works)
3. Get a [Resend](https://resend.com) API key for email OTP
4. Create a [Google OAuth 2.0 client](https://console.cloud.google.com) for Google login
5. Download MaxMind GeoLite2 database as `geoip.mmdb` into `traffic/`
6. Fill in `.env` files for each service
7. Deploy each service independently (Fly.io, Railway, Render, etc.)
8. Update `client/src/siteConfig.ts` with your deployed URLs

---

## License

MIT
