# Redline Repairs LLC — Site

A static site for [www.redlinerepairsllc.com](https://www.redlinerepairsllc.com), built with **Eleventy**
and edited through **Sveltia CMS**. Hosted on **GitHub Pages**, built by **GitHub Actions**.

## Stack

| Layer            | Technology                                          | Cost  |
|-------------------|-----------------------------------------------------|-------|
| Static site build | [Eleventy](https://www.11ty.dev/) (Nunjucks templates) | Free  |
| Hosting           | GitHub Pages, deployed via GitHub Actions           | Free  |
| Content editing   | [Sveltia CMS](https://github.com/sveltia/sveltia-cms) (GitHub backend) | Free  |
| CMS login         | Shared Cloudflare Worker OAuth proxy (`sveltia-cms-auth`) | Free  |
| Contact form      | Google Apps Script Web App → Google Sheet           | Free  |
| Reviews import    | Google Places API (New), scheduled GitHub Action    | Low/free |
| Preview builds    | Cloudflare Pages, auto-deployed from `sveltia-cms` branch | Free  |

## File structure

```
redline-repairs/
├── admin/                      ← Sveltia CMS
│   ├── index.html              ← loads the CMS bundle
│   └── config.yml              ← content model: collections, singletons, fields
├── src/
│   ├── content/                ← everything the CMS edits, lives here
│   │   ├── site.yml            ← business info, hours, map, contact-form URL, security
│   │   ├── announcement.yml    ← top-of-site announcement bar
│   │   ├── home.yml            ← homepage sections (ordered list of blocks)
│   │   ├── services/*.yml      ← one file per service
│   │   ├── reviews/*.yml       ← one file per review (status: pending/approved/rejected)
│   │   └── pages/*.yml         ← additional standalone pages (also block-based)
│   ├── _data/                  ← loads src/content/*.yml into Eleventy's data cascade
│   ├── _includes/
│   │   ├── layouts/base.njk    ← <head>, nav, footer, JSON-LD, wraps every page
│   │   ├── partials/           ← nav, footer, announcement bar, JSON-LD
│   │   └── blocks/             ← one template per section "type" (hero, services_list, etc.)
│   ├── css/style.css
│   ├── js/app.js               ← nav, map embed, contact form submit, back-to-top
│   ├── images/
│   ├── index.njk                ← renders home.yml's blocks
│   └── pages.njk                ← renders each entry in content/pages/*.yml
├── js/sheets-appscript.js       ← paste into Google Apps Script (not part of the site build)
├── scripts/import-reviews.mjs   ← pulls new Google reviews into content/reviews/ as "pending"
├── .github/workflows/
│   ├── build-deploy.yml         ← builds + deploys to GitHub Pages on push to main
│   ├── preview-deploy.yml       ← builds + deploys to Cloudflare Pages on push to sveltia-cms
│   └── import-reviews.yml       ← scheduled Google review import (currently paused, see below)
├── eleventy.config.js
└── package.json
```

## Local development

```bash
npm install
npm run dev      # eleventy --serve, live-reloads at http://localhost:8080
npm run build    # outputs the static site to _site/
```

No API keys or secrets are required to build or preview the site locally — all content lives in
`src/content/*.yml` as plain files.

## Editing content

Go to `/admin/` on the live site (or a preview deploy) and log in with GitHub. You'll need write
access to this repo. Sveltia CMS commits your changes directly to git; the next build picks them up
automatically.

- **Business info, hours, map, logo, contact-form URL, security settings** → *Site Settings* singleton
- **Announcement bar** (e.g. highlighting a new service) → *Announcement Bar* singleton
- **Homepage layout** — reorder, add, or remove sections → *Home Page Sections* singleton
- **Services** → *Services* collection (`featured: true` highlights one, e.g. for a promo)
- **Reviews** → *Reviews* collection — defaults to showing **Pending** entries first; flip `status`
  to `approved` to publish one, `rejected` to discard it. Only `approved` reviews render on the site.
- **New pages** → *Pages* collection — give it a `slug`, toggle `show_in_nav`, and compose it from the
  same section types as the homepage. Publishes at `/<slug>/`.

## Deployment

- **Production**: push to `main` → `.github/workflows/build-deploy.yml` builds with Eleventy and
  deploys to GitHub Pages.
- **Preview**: push to `sveltia-cms` (or whatever branch is under active development) →
  `.github/workflows/preview-deploy.yml` deploys to `https://redline-repairs-preview.pages.dev` via
  Cloudflare Pages. Use this to review changes before merging to `main`.

## Contact form

The form posts to a Google Apps Script Web App (`js/sheets-appscript.js`, pasted manually into the
Apps Script editor for the target Google Sheet — see the setup notes at the top of that file). It
writes to an "Inquiries" tab and emails a notification. This is independent of the Eleventy/CMS
rework and isn't touched by a normal content edit or site rebuild.

**Spam protection**, in order: a hidden honeypot field, a client-side minimum-time check, and
(optional, recommended) [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/),
verified **server-side** in the Apps Script so a scripted request can't just skip the site's JS and
POST straight to the Web App URL. To turn Turnstile on:

1. Create a Turnstile widget in the Cloudflare dashboard for your domain(s) → get a site key + secret key.
2. Site Settings → Security → paste the **site key** (public) in the CMS.
3. In the Apps Script project: **Project Settings → Script Properties** → add
   `TURNSTILE_SECRET_KEY` = the **secret key**.
4. Re-paste `js/sheets-appscript.js` into the Apps Script editor if it's changed, then
   **Deploy → Manage deployments → Edit → New version**.

Leaving the site key blank keeps the form working exactly as before, with no Turnstile challenge.

## Reviews import

`scripts/import-reviews.mjs` calls the Google Places API (New) for up to ~5 "most relevant" reviews
per place — that's a hard limit Google's API imposes, not something this script can work around.
New reviews land as `content/reviews/google-<hash>.yml` with `status: pending`; it never touches a
file that already exists, so an owner's moderation decision is never overwritten by a re-run.

The scheduled run (`.github/workflows/import-reviews.yml`) is currently **paused** (cron commented
out) until `GOOGLE_PLACES_API_KEY` and `GOOGLE_PLACE_ID` repo secrets are set — `workflow_dispatch`
still works for a manual test run. To enable:

1. Google Cloud Console: create/select a project, enable billing, enable **Places API (New)**.
2. Create an API key restricted to **Places API (New)** only (no application/IP restriction —
   GitHub Actions runner IPs aren't fixed).
3. Add repo secrets `GOOGLE_PLACES_API_KEY` and `GOOGLE_PLACE_ID`.
4. Uncomment the `schedule:` block in `.github/workflows/import-reviews.yml`.

## CMS login (GitHub OAuth)

Sveltia CMS's GitHub backend needs a token-exchange proxy, since GitHub OAuth requires a
confidential client secret. `admin/config.yml`'s `backend.base_url` points at an existing
Cloudflare Worker (`sveltia-cms-auth`) already used for other sites — the same GitHub OAuth App and
Worker can serve any number of repos; the only per-site setting is the Worker's `ALLOWED_DOMAINS`
env var, which needs each new domain appended (not replacing existing ones).
