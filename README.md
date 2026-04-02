# visitor-id-worker

A Cloudflare Worker that generates a UUID v4 and sets it as a 1st-party server-side `visitor_id` cookie.

## Overview

When a new visitor arrives without a `visitor_id` cookie, this Worker generates a UUID v4 using `crypto.randomUUID()` and attaches it via the `Set-Cookie` response header. Returning visitors are passed through with zero overhead.

Unlike browser-side (JavaScript) cookies, server-side cookies issued from the edge are **not affected by ITP or other tracking prevention restrictions**.

## Deploy

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- Cloudflare account with a zone (domain)

### 1. Clone

```bash
git clone https://github.com/takaakisuzuki/visitor-id-worker.git
cd visitor-id-worker
npm install
```

### 2. Configure

Edit `wrangler.toml` and set the routes section with your domain:

```toml
name = "visitor-id-worker"
main = "src/index.ts"
compatibility_date = "2024-09-23"

[[routes]]
pattern = "example.com/*"
zone_name = "example.com"
```

Optionally, edit cookie settings in `src/index.ts`:

```typescript
const COOKIE_NAME = "visitor_id";           // Cookie name
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;  // 1 year
```

### 3. Local Development

```bash
npx wrangler dev
```

### 4. Deploy

```bash
npx wrangler deploy
```

### 5. Verify

Check real-time logs:

```bash
npx wrangler tail
```

Check via curl:

```bash
curl -v https://example.com 2>&1 | grep -i set-cookie
```

## License

MIT
