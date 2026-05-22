/**
 * =====================================================
 *  REDLINE REPAIRS LLC — App Logic
 *  Handles: nav, services, reviews, map, contact form,
 *           Square booking modal, Google Sheets data
 * =====================================================
 */

/* ── DOM READY ─────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  initNav();
  setYear();
  loadServices();
  loadReviews();
  loadMission();
  initMap();
  initBookingModal();
  initBackToTop();
});

/* ── NAV ─────────────────────────────────────────── */
function initNav() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });
}

function toggleMobileMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}
function closeMobileMenu() {
  document.getElementById('mobileMenu').classList.remove('open');
}

function setYear() {
  document.getElementById('year').textContent = new Date().getFullYear();
}

/* ── BACK TO TOP ─────────────────────────────────── */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });
}

/* ── GOOGLE SHEETS — CSV PARSER ───────────────────
   Google Sheets → File → Share → Publish to web → CSV
   Returns array of objects keyed by first-row headers.
─────────────────────────────────────────────────── */
async function fetchSheet(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const text = await res.text();
  const rows = parseCSV(text);
  if (rows.length < 2) return [];
  const headers = rows[0].map(h => h.trim().toLowerCase().replace(/\s+/g, '_'));
  return rows.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = (row[i] || '').trim(); });
    return obj;
  });
}

function parseCSV(text) {
  const rows = [];
  let row = [], cur = '', inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (inQ && text[i+1] === '"') { cur += '"'; i++; }
      else inQ = !inQ;
    } else if (c === ',' && !inQ) {
      row.push(cur); cur = '';
    } else if ((c === '\n' || c === '\r') && !inQ) {
      if (c === '\r' && text[i+1] === '\n') i++;
      row.push(cur); cur = '';
      if (row.some(x => x)) rows.push(row);
      row = [];
    } else cur += c;
  }
  if (cur || row.length) { row.push(cur); if (row.some(x => x)) rows.push(row); }
  return rows;
}

/* ── SERVICES ─────────────────────────────────────── */
async function loadServices() {
  const grid = document.getElementById('servicesGrid');
  try {
    let services = DEFAULT_SERVICES;

    if (SITE_CONFIG.sheets.servicesUrl) {
      const rows = await fetchSheet(SITE_CONFIG.sheets.servicesUrl);
      const visible = rows.filter(r => r.visible !== 'false' && r.visible !== '0' && r.visible !== 'FALSE');
      if (visible.length) services = visible;
    }

    grid.innerHTML = '';
    services.forEach(svc => {
      const card = document.createElement('div');
      card.className = 'service-card';
      card.innerHTML = `
        ${svc.imageUrl
          ? `<img src="${escapeHtml(svc.imageUrl)}" alt="${escapeHtml(svc.name)}" loading="lazy">`
          : `<div class="service-img-placeholder"><i data-lucide="wrench"></i></div>`}
        <div class="service-body">
          <h3>${escapeHtml(svc.name)}</h3>
          <p>${escapeHtml(svc.description)}</p>
          <button class="btn-service" onclick="openBooking()">
            <span>Book This Service</span>
            <i data-lucide="arrow-right"></i>
          </button>
        </div>`;
      grid.appendChild(card);
    });
    lucide.createIcons();
  } catch (err) {
    console.error('Services load error:', err);
    grid.innerHTML = '';
    DEFAULT_SERVICES.forEach(svc => {
      const card = document.createElement('div');
      card.className = 'service-card';
      card.innerHTML = `
        <img src="${svc.imageUrl}" alt="${svc.name}" loading="lazy">
        <div class="service-body">
          <h3>${escapeHtml(svc.name)}</h3>
          <p>${escapeHtml(svc.description)}</p>
          <button class="btn-service" onclick="openBooking()">
            <span>Book This Service</span><i data-lucide="arrow-right"></i>
          </button>
        </div>`;
      grid.appendChild(card);
    });
    lucide.createIcons();
  }
}

/* ── REVIEWS ─────────────────────────────────────── */
async function loadReviews() {
  const grid = document.getElementById('reviewsGrid');
  try {
    let reviews = DEFAULT_REVIEWS;

    if (SITE_CONFIG.sheets.reviewsUrl) {
      const rows = await fetchSheet(SITE_CONFIG.sheets.reviewsUrl);
      const visible = rows.filter(r => r.visible !== 'false' && r.visible !== '0' && r.visible !== 'FALSE');
      if (visible.length) {
        reviews = visible.map(r => ({
          author: r.author,
          rating: parseInt(r.rating) || 5,
          text: r.text,
          date: r.date,
          avatar: r.avatar || '',
        }));
      }
    }

    // Update summary
    const avg = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);
    document.getElementById('ratingNum').textContent = avg;
    document.getElementById('ratingCount').textContent = `(${reviews.length} reviews)`;
    document.getElementById('summaryStars').innerHTML = renderStarsSVG(Math.round(avg));

    grid.innerHTML = '';
    reviews.slice(0, 9).forEach(r => {
      const card = document.createElement('div');
      card.className = 'review-card';
      card.innerHTML = `
        <svg class="review-quote" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
        <div class="review-header">
          ${r.avatar
            ? `<img class="review-avatar" src="${escapeHtml(r.avatar)}" alt="${escapeHtml(r.author)}" loading="lazy">`
            : `<div class="review-avatar" style="display:flex;align-items:center;justify-content:center;background:var(--primary-l);color:white;font-family:'Barlow Condensed',sans-serif;font-size:1.4rem;font-weight:700;">${(r.author||'?')[0]}</div>`}
          <div class="review-author">
            <strong>${escapeHtml(r.author)}</strong>
            <span>${escapeHtml(r.date)}</span>
          </div>
        </div>
        <div class="review-stars">${renderStarsSVG(r.rating)}</div>
        <p class="review-text">${escapeHtml(r.text)}</p>
        <div class="review-footer">
          <span class="review-verified"><i data-lucide="check-circle"></i> Verified Google Review</span>
        </div>`;
      grid.appendChild(card);
    });
    lucide.createIcons();
  } catch (err) {
    console.error('Reviews load error:', err);
    grid.innerHTML = '<p style="text-align:center;color:var(--gray-400);padding:2rem;">Reviews temporarily unavailable.</p>';
  }
}

function renderStarsSVG(rating) {
  return Array.from({ length: 5 }, (_, i) => {
    const cls = i < rating ? 'star filled' : 'star empty';
    return `<svg class="${cls}" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
  }).join('');
}

/* ── MISSION ─────────────────────────────────────── */
async function loadMission() {
  try {
    if (!SITE_CONFIG.sheets.missionUrl) return;
    const rows = await fetchSheet(SITE_CONFIG.sheets.missionUrl);
    if (rows[0]) {
      if (rows[0].heading) document.getElementById('missionHeading').textContent = rows[0].heading;
      if (rows[0].paragraph) document.getElementById('missionText').textContent = rows[0].paragraph;
    }
  } catch (err) {
    console.error('Mission load error:', err);
  }
}

/* ── GOOGLE MAP ───────────────────────────────────── */
function initMap() {
  const mapDiv = document.getElementById('map');
  const fallback = document.getElementById('mapFallback');

  // Use embed iframe
  mapDiv.innerHTML = `<iframe
    src="${SITE_CONFIG.mapEmbedUrl}"
    width="100%" height="100%" style="border:0;" allowfullscreen loading="lazy"
    referrerpolicy="no-referrer-when-downgrade"></iframe>`;
  fallback.style.display = 'none';
}


/* ── BOOKING MODAL ───────────────────────────────── */
function initBookingModal() {
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeBooking();
  });
  buildModalContent();
}

function buildModalContent() {
  const body = document.getElementById('modalBody');
  const url = SITE_CONFIG.square.bookingUrl;
  if (url) {
    body.innerHTML = `<iframe src="${url}" title="Square Appointments Booking" allow="payment" loading="lazy"></iframe>`;
  } else {
    body.innerHTML = `
      <div class="modal-phone-fallback">
        <i data-lucide="calendar"></i>
        <h3>Book by Phone</h3>
        <p>Online booking is coming soon. Call us to schedule your appointment.</p>
        <a href="tel:+19033305749">(903) 330-5749</a>
      </div>`;
    lucide.createIcons();
  }
}

function openBooking() {
  document.getElementById('bookingOverlay').style.display = 'block';
  document.getElementById('bookingModal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}
function closeBooking() {
  document.getElementById('bookingOverlay').style.display = 'none';
  document.getElementById('bookingModal').style.display = 'none';
  document.body.style.overflow = '';
}

/* ── CONTACT FORM → GOOGLE SHEETS ──────────────────
   Submits to a Google Apps Script Web App.
   Instructions in README.md and js/sheets-appscript.js
─────────────────────────────────────────────────── */
async function submitInquiry(e) {
  e.preventDefault();
  const form = document.getElementById('contactForm');
  const btn = document.getElementById('submitBtn');
  const successEl = document.getElementById('formSuccess');
  const errorEl = document.getElementById('formError');

  successEl.style.display = 'none';
  errorEl.style.display = 'none';

  const data = Object.fromEntries(new FormData(form).entries());

  // If no Apps Script URL configured, show a mailto fallback
  if (!SITE_CONFIG.sheets.formWebAppUrl) {
    const subject = encodeURIComponent(`Inquiry: ${data.subject}`);
    const body = encodeURIComponent(`Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\nMessage: ${data.message}`);
    window.location.href = `mailto:${SITE_CONFIG.business.email}?subject=${subject}&body=${body}`;
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '<div class="spinner" style="width:20px;height:20px;border-width:2px;margin:0 auto;"></div>';

  try {
    const webAppUrl = SITE_CONFIG.sheets.formWebAppUrl;
    await fetch(webAppUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, timestamp: new Date().toISOString() }),
    });

    // no-cors means we can't read the response, but success is the default assumption
    successEl.style.display = 'block';
    form.reset();
    successEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } catch (err) {
    errorEl.textContent = 'Failed to send. Please call us directly or email redlinerepairsllc@icloud.com';
    errorEl.style.display = 'block';
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i data-lucide="send"></i> Send Message';
    lucide.createIcons();
  }
}

/* ── UTILITY ─────────────────────────────────────── */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
