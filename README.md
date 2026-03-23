# visitor-id-worker

A Cloudflare Worker that generates a UUID v4 and sets it as a 1st party server-side `visitor_id` cookie.

Cloudflare Worker を使って UUID v4 を生成し、1st Party サーバーサイド `visitor_id` Cookie を付与します。

---

## What is this? / これは何？

When a new visitor arrives without a `visitor_id` cookie, this Worker generates a UUID v4 using `crypto.randomUUID()` and attaches it via the `Set-Cookie` response header. Returning visitors are passed through with zero overhead.

`visitor_id` Cookie を持たない新規訪問者にのみ、`crypto.randomUUID()` で UUID v4 を生成し `Set-Cookie` レスポンスヘッダーで付与します。既存訪問者はそのままパススルーされます。

Unlike browser-side (JavaScript) cookies, server-side cookies issued from the edge are not affected by ITP or other tracking prevention restrictions.

ブラウザ側（JavaScript）で発行する Cookie と異なり、エッジから発行するサーバーサイド Cookie は ITP 等のトラッキング防止の制限を受けません。

---

## Deploy / デプロイ方法

### Prerequisites / 前提条件

- [Node.js](https://nodejs.org/) v18+
- Cloudflare account with a zone (domain) / Cloudflare アカウント（ゾーン設定済み）

### 1. Clone / クローン

```bash
git clone https://github.com/takaakisuzuki/visitor-id-worker.git
cd visitor-id-worker
npm install
```

### 2. Configure / 設定

Edit `wrangler.toml` and uncomment the routes section with your domain:

`wrangler.toml` を編集し、routes セクションのコメントを外して自分のドメインを設定してください：

```toml
name = "visitor-id-worker"
main = "src/index.ts"
compatibility_date = "2024-09-23"

[[routes]]
pattern = "example.com/*"
zone_name = "example.com"
```

Optionally, edit cookie settings in `src/index.ts`:

必要に応じて `src/index.ts` の Cookie 設定を変更できます：

```typescript
const COOKIE_NAME = "visitor_id";        // Cookie name / Cookie 名
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year / 1年
```

### 3. Local development / ローカル開発

```bash
npx wrangler dev
```

### 4. Deploy / デプロイ

```bash
npx wrangler deploy
```

### 5. Verify / 確認

Check real-time logs / リアルタイムログの確認：

```bash
npx wrangler tail
```

Check via curl / curl で確認：

```bash
curl -v https://example.com 2>&1 | grep -i set-cookie
```

---

## License

MIT
