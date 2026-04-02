# visitor-id-worker

A Cloudflare Worker that generates a UUID v4 and sets it as a 1st-party server-side `visitor_id` cookie — designed for use as an [Adobe Experience Platform FPID (First-Party ID)](https://business.adobe.com/jp/blog/the-latest/dx-analytics-tips-itp-fpid).

## Why

Safari's ITP (Intelligent Tracking Prevention) caps the lifetime of client-side (JavaScript) cookies to 7 days, breaking visitor identification in Adobe Analytics / Experience Platform. The recommended solution is to issue a **First-Party ID (FPID)** via a server-side `Set-Cookie` header so the cookie is treated as a true 1st-party cookie and is **exempt from ITP restrictions**.

This Worker runs on Cloudflare's edge, generates a UUID v4 per new visitor, and sets it as a server-side cookie — ready to be used as an FPID with the Adobe Experience Platform Web SDK.

## Overview

When a new visitor arrives without a `visitor_id` cookie, this Worker generates a UUID v4 using `crypto.randomUUID()` and attaches it via the `Set-Cookie` response header. Returning visitors are passed through with zero overhead.

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
