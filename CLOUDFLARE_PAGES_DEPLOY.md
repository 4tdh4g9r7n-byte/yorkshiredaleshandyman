# Deploying Yorkshire Dales Handyman to Cloudflare Pages

This site is fully static (HTML/CSS/JavaScript, no build step, no server, no database), so it deploys to Cloudflare Pages in minutes.

## Option A — Drag and drop (fastest, no account setup beyond signing up)

1. Go to the [Cloudflare dashboard](https://dash.cloudflare.com/) and sign in (free account is enough).
2. Go to **Workers & Pages** → **Create** → **Pages** → **Upload assets**.
3. Give the project a name (e.g. `yorkshire-dales-handyman`).
4. Drag in every file from this folder (`index.html`, `style.css`, `base.css`, `app.js`, `_headers`, and the `assets` folder if it has files in it).
5. Click **Deploy site**. Cloudflare gives you a free `*.pages.dev` URL immediately.
6. To use your own domain later (e.g. `yorkshiredaleshandyman.co.uk`), go to the project's **Custom domains** tab and follow the prompts — Cloudflare handles HTTPS automatically at no extra cost.

## Option B — Connect a Git repository (best if you'll keep editing the site)

1. Push this folder to a GitHub or GitLab repository.
2. In the Cloudflare dashboard: **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Select the repository. Build settings:
   - **Framework preset:** None
   - **Build command:** (leave blank)
   - **Build output directory:** `/`
4. Click **Save and Deploy**. Every future push to the repo redeploys the site automatically.

## What's included for security

- `_headers` — sets standard security headers (Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) and long-term caching for CSS/JS. Cloudflare Pages reads this file automatically; no configuration needed.
- The site has no backend, database, or user data storage, so there's nothing else to secure — Cloudflare's free tier adds HTTPS/TLS, DDoS protection, and a global CDN automatically.

## Before going live

- Replace the placeholder phone number in the footer if you haven't already.
- Activate the quote form (see below) — without this step, submissions will show an error message instead of sending.

## Activating the quote form (2 minutes, free)

The quote form is wired up to send to [Web3Forms](https://web3forms.com), a free form-to-email service (no account needed to start, 250 free submissions/month, no server or code to maintain).

1. Go to [web3forms.com](https://web3forms.com) and enter the email address that should receive quote requests (use `enquiries@yorkshiredaleshandyman.co.uk` once that mailbox is live, or any inbox you check today — you can change it later).
2. Check that inbox for a verification email and confirm it.
3. Web3Forms shows you a free **Access Key** — copy it.
4. Open `index.html`, find this line near the top of the quote form (search for `YOUR_WEB3FORMS_ACCESS_KEY`):
   ```html
   <input type="hidden" name="access_key" value="YOUR_WEB3FORMS_ACCESS_KEY" />
   ```
5. Replace `YOUR_WEB3FORMS_ACCESS_KEY` with the key you copied, save, and redeploy (drag the updated folder back into Cloudflare Pages, or push to Git if using the Git-connected method).

That's it — quote requests will land straight in the inbox you verified, with all the visitor's details (name, postcode, phone, job description, etc.) in the email body. Note: photo uploads aren't attached automatically on Web3Forms' free plan, so the form asks visitors to email photos separately — upgrading to a paid Web3Forms plan later would add that if needed.
