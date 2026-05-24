# Instagram Feed setup

The **Instagram Feed** block (available in the page layout builder) displays your latest
Instagram posts. It runs in two modes:

- **Live** — pulls recent posts from the Instagram Graph API using an access token.
- **Manual** — no token required; you curate posts by hand in the block's _Fallback posts_ field.

If the API token is missing or a request fails, the block automatically falls back to the
manual posts, so the site never breaks.

> A condensed version of these steps is also shown in the admin dashboard (Instagram feed setup panel).

---

## Option A — Live feed (Instagram Graph API)

Instagram's old _Basic Display API_ was deprecated. Use the **Instagram API with Instagram Login**
(Graph API) flow below.

### 1. Use a professional Instagram account

In the Instagram mobile app: **Settings → Account type and tools → Switch to professional account**
(Creator or Business). A personal account cannot use the API.

### 2. Create a Meta app

1. Go to <https://developers.facebook.com/apps> and sign in.
2. **Create app → Other → Business**.
3. On the app dashboard, **Add product → Instagram → "API setup with Instagram login"**.

### 3. Add your account & generate a token

1. In **Instagram → API setup with Instagram login**, add your Instagram account as an
   **Instagram tester**, then accept the invite in the Instagram app
   (Settings → Apps and websites → Tester invites).
2. Generate a **long-lived access token** with at least the `instagram_business_basic` scope.
3. Copy the token.

### 4. Configure the environment variable

Add the token wherever the app runs:

- **Local:** add to `.env`
  ```
  INSTAGRAM_ACCESS_TOKEN=IGQVJ...your-long-lived-token
  ```
- **Production (Cloudflare):** add `INSTAGRAM_ACCESS_TOKEN` as a project variable/secret, e.g.
  ```
  wrangler secret put INSTAGRAM_ACCESS_TOKEN
  ```
  (or add it in the Cloudflare dashboard → Workers project → Settings → Variables), then redeploy.

Restart the dev server / redeploy so the variable is picked up.

### 5. Keep the token alive (important)

Long-lived tokens expire after **~60 days**. Refresh before expiry:

```
GET https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=YOUR_CURRENT_TOKEN
```

Paste the returned token back into `INSTAGRAM_ACCESS_TOKEN`. (Consider a calendar reminder, or
automate it with a scheduled Cloudflare Worker/cron that refreshes and updates the secret.)

---

## Option B — Manual posts (no token)

1. Add the **Instagram Feed** block to a page.
2. Leave the API token unset.
3. Expand **Fallback posts** and add image + (optional) link + caption for each post.

These render exactly like live posts and never expire.

---

## Using the block

In the page layout builder, add **Instagram Feed** and set:

- **Heading** — section title (default "Instagram").
- **Instagram username** — handle for the "Follow" link (e.g. `laurabeckart`).
- **Limit** — number of posts (max 24).
- **Columns** — 2 / 3 / 4 / 6.
- **Fallback posts** — manual posts used when no live token is configured.

## Caching & images

- API responses are cached for 1 hour (Next.js fetch cache).
- Instagram CDN images are rendered with a plain `<img>` (their hostnames vary and aren't in
  `next.config.ts` `remotePatterns`); manual fallback images use the site's optimized `Media`
  component.

## Troubleshooting

- **Nothing shows / falls back to manual:** token missing, expired, or the account isn't a
  professional account / tester. Check server logs for `[instagram]` errors.
- **`media_url` 403 / broken image:** the token expired — refresh it (step 5).
- **Videos:** the post's thumbnail is shown and links to the Instagram permalink.
