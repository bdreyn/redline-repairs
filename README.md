# Redline Repairs LLC — Static Site

A clean, fast static site for GitHub Pages.  
**No build step. No Netlify. No Supabase.** Just HTML, CSS, and vanilla JS.

---

## Stack

| Layer       | Technology                         | Cost  |
|-------------|-------------------------------------|-------|
| Hosting     | GitHub Pages                        | Free  |
| Database    | Google Sheets (published CSV)       | Free  |
| Form inbox  | Google Apps Script Web App          | Free  |
| Payments    | Square Appointments (embedded)      | Free  |
| Map         | Google Maps JS API                  | Free* |
| Domain      | Your existing Square domain (CNAME) | Existing |

*Google Maps has a monthly free tier ($200/month credit) — far more than enough for a small business site.

---

## File Structure

```
redline-repairs/
├── index.html              ← Single-page site
├── css/
│   └── styles.css          ← All styling
├── js/
│   ├── config.js           ← ⬅ Edit this first — all settings here
│   ├── app.js              ← App logic (don't need to touch)
│   └── sheets-appscript.js ← Paste into Google Apps Script
└── README.md
```

---

## Quick Start

### 1. Upload to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USER/redline-repairs.git
git push -u origin main
```

Then in GitHub → Settings → Pages → Source: **Deploy from branch** → `main` → `/ (root)`.

Your site will be live at `https://YOUR_USER.github.io/redline-repairs/`

---

### 2. Edit `js/config.js`

Open `js/config.js` and fill in the blanks. That file controls everything — business info, API keys, Square URL, Sheets URLs.

---

## Google Sheets Backend

### Step 1 — Create the Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a new spreadsheet.
2. Name it **Redline Repairs CMS**.
3. Create these tabs (exact names matter):

#### Tab: `Services`
| name | description | imageUrl | order | visible |
|------|-------------|----------|-------|---------|
| Oil Change | Full synthetic oil change... | https://... | 1 | TRUE |

#### Tab: `Reviews`
| author | rating | text | date | avatar | visible |
|--------|--------|------|------|--------|---------|
| Marcus T. | 5 | Great shop! | April 2025 | | TRUE |

#### Tab: `Mission`
| heading | paragraph |
|---------|-----------|
| Our Mission | At Redline Repairs... |

#### Tab: `Inquiries`
*(Leave this blank — the Apps Script will add the header row automatically.)*

---

### Step 2 — Publish Sheets as CSV

For the **Services**, **Reviews**, and **Mission** tabs:

1. **File → Share → Publish to web**
2. Select the tab (e.g., "Services")
3. Format: **Comma-separated values (.csv)**
4. Click **Publish** → copy the URL
5. Paste into `js/config.js` under `sheets.servicesUrl` / `sheets.reviewsUrl` / `sheets.missionUrl`

> **Important:** Each tab needs its own published URL.

---

### Step 3 — Set Up Contact Form (Apps Script)

1. In your Google Sheet: **Extensions → Apps Script**
2. Delete any existing code in the editor
3. Copy the entire contents of `js/sheets-appscript.js` and paste it in
4. Click **Save** (floppy disk icon)
5. Click **Deploy → New deployment**
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
6. Click **Deploy** → authorize the permissions
7. Copy the **Web App URL** (looks like `https://script.google.com/macros/s/.../exec`)
8. Paste it into `js/config.js` → `sheets.formWebAppUrl`

**Test it:** In Apps Script, select the `testSetup` function and click ▶ Run. You should see a new row appear in the Inquiries tab.

---

## Square Booking Integration

1. In Square Dashboard → **Appointments → Settings → Online Booking**
2. Under **Booking Website**, click **Share booking site** or look for the **Widget** embed option
3. The booking URL looks like:  
   `https://squareup.com/appointments/buyer/widget/XXXXX/YYYYY`
4. Paste that URL into `js/config.js` → `square.bookingUrl`

The "Book Now" button will open a modal with the Square booking calendar embedded.

---

## Google Maps Setup

### Option A — API Key (recommended)
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a project → Enable **Maps JavaScript API**
3. Create an API key → **Restrict it to your domain** (e.g., `*.github.io/redline-repairs/*`)
4. Paste key into `js/config.js` → `google.mapsApiKey`

### Option B — Embed URL (no key needed)
1. Go to [maps.google.com](https://maps.google.com) → search your address
2. Click **Share → Embed a map** → copy the `src` URL from the iframe code
3. Paste into `js/config.js` → `mapEmbedUrl`
4. Leave `google.mapsApiKey` blank

---

## Google API Security (Domain Restriction)

**You must restrict your API keys to prevent unauthorized use.**

### Maps JavaScript API Key
1. [console.cloud.google.com](https://console.cloud.google.com) → Credentials → click your key
2. Under **Application restrictions** → **HTTP referrers (websites)**
3. Add these referrers:
   ```
   https://YOUR_USER.github.io/*
   https://www.redlinerepairsllc.com/*
   https://redlinerepairsllc.com/*
   ```
4. Under **API restrictions** → **Restrict key** → select **Maps JavaScript API**
5. Save

### Places API Key (if used)
Same process, restrict to **Places API** only.

> **Note:** Keys stored in `config.js` are visible in the browser. Restricting by HTTP referrer is the correct mitigation — an exposed key restricted to your domain can only be used to load maps *on your domain*.

---

## Custom Domain (redlinerepairsllc.com)

To point your existing domain to GitHub Pages instead of Square:

1. In GitHub → Settings → Pages → **Custom domain** → enter `www.redlinerepairsllc.com`
2. In your DNS provider, add:
   ```
   Type: CNAME
   Name: www
   Value: YOUR_USER.github.io
   ```
3. For the apex domain (`redlinerepairsllc.com`), add four A records:
   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```
4. Check **Enforce HTTPS** in GitHub Pages settings once DNS propagates (~24 hrs)

---

## Updating Content

### Services / Reviews / Mission
Edit directly in your Google Sheet. Changes appear on the site within a minute (CSV is re-fetched on each page load). No deployment needed.

### Site info (phone, hours, address, etc.)
Edit `js/config.js` → commit and push to GitHub. GitHub Pages rebuilds automatically.

### Styling
Edit `css/styles.css` → commit and push.

---

## Removing the Old Supabase / Netlify Setup

The original Bolt/Vite/React codebase is no longer needed. This replacement:
- Has no npm dependencies
- Has no build step
- Loads in under 2 seconds on mobile
- Costs $0/month to host

You can archive or delete the original GitHub repo, or simply replace its contents with these files.
