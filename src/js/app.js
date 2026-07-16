/**
 * =====================================================
 *  REDLINE REPAIRS LLC — App Logic
 * =====================================================
 */

/* ── BOT PROTECTION ──────────────────────────────── */
// Record page load time; submissions under 3 seconds are almost certainly bots
const _pageLoadTime = Date.now();

/* ── DOM READY ─────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Guard: if Lucide fails to load, don't let it crash everything else
  try { if (typeof lucide !== 'undefined') lucide.createIcons(); } catch(e) { console.warn('Lucide icons unavailable:', e); }
  initNav();
  initEventListeners();
  setYear();
  initMap();
  initBackToTop();
  initEmail();
});

/* ── EVENT LISTENERS (replaces all inline onclick/onsubmit) ── */
function initEventListeners() {
  const scrollToContact = () =>
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });

  // Nav "Contact Us" button
  document.getElementById('navContactBtn')
    ?.addEventListener('click', scrollToContact);

  // Hero "Request Service" button
  document.getElementById('heroRequestBtn')
    ?.addEventListener('click', scrollToContact);

  // Hamburger — toggle mobile menu
  document.getElementById('hamburger')
    ?.addEventListener('click', () =>
      document.getElementById('mobileMenu').classList.toggle('open'));

  // Mobile menu — close on any nav link click
  document.querySelectorAll('.mobile-nav-link').forEach(link =>
    link.addEventListener('click', closeMobileMenu));

  // Mobile "Request Service" button
  document.getElementById('mobileRequestBtn')
    ?.addEventListener('click', () => { scrollToContact(); closeMobileMenu(); });

  // Back-to-top button
  document.getElementById('backToTop')
    ?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Contact form submit
  document.getElementById('contactForm')
    ?.addEventListener('submit', submitInquiry);

  // Service card buttons — event delegation (cards are server-rendered by Eleventy)
  document.getElementById('servicesGrid')
    ?.addEventListener('click', e => {
      const btn = e.target.closest('.btn-service');
      if (btn) requestService(btn.dataset.service);
    });
}

/* ── NAV ─────────────────────────────────────────── */
function initNav() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });
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

/* ── REQUEST SERVICE — scroll to form + pre-fill ── */
function requestService(serviceName) {
  // Set subject dropdown to Appointment Request
  const subject = document.getElementById('fsubject');
  if (subject) subject.value = 'Appointment Request';

  // Pre-fill message with service name
  const message = document.getElementById('fmessage');
  if (message) message.value = `I'd like to schedule a${/^[aeiou]/i.test(serviceName) ? 'n' : ''} ${serviceName}.`;

  // Scroll to contact form
  const contact = document.getElementById('contact');
  if (contact) {
    contact.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Focus the name field after scroll
    setTimeout(() => {
      const nameField = document.getElementById('fname');
      if (nameField) nameField.focus();
    }, 600);
  }
}

/* ── GOOGLE MAP ───────────────────────────────────── */
function initMap() {
  const mapDiv = document.getElementById('map');
  const fallback = document.getElementById('mapFallback');
  mapDiv.innerHTML = `<iframe
    src="${SITE_CONFIG.mapEmbedUrl}"
    width="100%" height="100%" style="border:0;" allowfullscreen loading="lazy"
    referrerpolicy="no-referrer-when-downgrade"></iframe>`;
  fallback.style.display = 'none';
}

/* ── CONTACT FORM → GOOGLE SHEETS ────────────────── */
async function submitInquiry(e) {
  e.preventDefault();
  const form = document.getElementById('contactForm');
  const btn = document.getElementById('submitBtn');
  const successEl = document.getElementById('formSuccess');
  const errorEl = document.getElementById('formError');

  successEl.style.display = 'none';
  errorEl.style.display = 'none';

  const data = Object.fromEntries(new FormData(form).entries());

  // Honeypot check — real users never fill the hidden "website" field
  if (data.website) {
    // Silently succeed to avoid tipping off bots that they were caught
    successEl.style.display = 'block';
    form.reset();
    return;
  }

  // Minimum time check — reject submissions faster than 3 seconds (bots)
  if (Date.now() - _pageLoadTime < 3000) {
    errorEl.textContent = 'Please take a moment to review your message before sending.';
    errorEl.style.display = 'block';
    return;
  }

  // Remove honeypot field from payload before sending
  delete data.website;

  if (!SITE_CONFIG.sheets.formWebAppUrl) {
    const subject = encodeURIComponent(`Inquiry: ${data.subject}`);
    const body = encodeURIComponent(`Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\nMessage: ${data.message}`);
    window.location.href = `mailto:${SITE_CONFIG.business.email}?subject=${subject}&body=${body}`;
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '<div class="spinner" style="width:20px;height:20px;border-width:2px;margin:0 auto;"></div>';

  try {
    await fetch(SITE_CONFIG.sheets.formWebAppUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, timestamp: new Date().toISOString() }),
    });
    successEl.style.display = 'block';
    form.reset();
    successEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } catch (err) {
    errorEl.textContent = `Failed to send. Please call us at ${SITE_CONFIG.business.phone} or email ${SITE_CONFIG.business.email}`;
    errorEl.style.display = 'block';
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i data-lucide="send"></i> Send Message';
    try { if (typeof lucide !== 'undefined') lucide.createIcons(); } catch(e) {}
  }
}

/* ── EMAIL OBFUSCATION ───────────────────────────── */
// Split so the plain address never appears in source — defeats simple scrapers
function initEmail() {
  const user   = 'redlinerepairsllc';
  const domain = 'icloud.com';
  const addr   = user + '@' + domain;
  const href   = 'mailto:' + addr;
  ['contactEmail', 'footerEmail'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.href        = href;
    el.textContent = addr;
    el.onclick     = null;
  });
}
