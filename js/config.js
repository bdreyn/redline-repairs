/**
 * =====================================================
 *  REDLINE REPAIRS LLC — Site Configuration
 *  Edit this file to customize your site.
 *  NO BUILD STEP REQUIRED — just edit & push to GitHub.
 * =====================================================
 */
const SITE_CONFIG = {

  // ── BUSINESS INFO ────────────────────────────────
  business: {
    name:    'Redline Repairs LLC',
    tagline: 'Premium Auto Repair You Can Trust',
    phone:   '(903) 330-5749',
    email:   'redlinerepairsllc@icloud.com',
    address: '6252 Rhones Quarter Rd\nTyler, Texas 75707',
    hours: {
      mon_fri:  '9:00 AM - 5:00 PM',
      saturday: 'Closed',
      sunday:   'Closed',
    },
    social: {
      facebook:  'https://www.facebook.com/RedlineRepairsLLC',
      instagram: 'https://www.instagram.com/redlinerepairsllc',
      twitter:   '',
    },
  },

  // ── SQUARE BOOKING ────────────────────────────────
  // Square Dashboard -> Appointments -> Online Booking -> Share
  // Looks like: https://squareup.com/appointments/buyer/widget/...
square: {
  bookingUrl: 'k8y6rrsbcp4q3z/LHR8XX3V8EAJM',
},

  // ── GOOGLE SHEETS BACKEND ────────────────────────
  // See README.md for full setup instructions.
  // Leave URLs empty to use the built-in defaults below.
sheets: {
    servicesUrl:   'https://docs.google.com/spreadsheets/d/e/2PACX-1vTtNxn2yfh0DimMOq8qkxoRvC8Z7ZX7aZO9jiTRcAO5YLg5vjW5hbfLqTU6hcVIM7QouXNGO9gNkCb0/pub?gid=1995874112&single=true&output=csv',
    reviewsUrl:    'https://docs.google.com/spreadsheets/d/e/2PACX-1vTtNxn2yfh0DimMOq8qkxoRvC8Z7ZX7aZO9jiTRcAO5YLg5vjW5hbfLqTU6hcVIM7QouXNGO9gNkCb0/pub?gid=0&single=true&output=csv',
    formWebAppUrl: 'https://script.google.com/macros/s/AKfycbzC4LayBQzLZLZg9M2IRCSY-kcJ8pCM7GjL_Iy6l8ew3gLn_KUY6BK4_-7EAJ3HpUiW/exec',
  },

  // ── GOOGLE MAPS EMBED ─────────────────────────────
  // From Google Maps -> Share -> Embed a map -> copy src URL
  mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3373.1770729676596!2d-95.26384802371042!3d32.28021690920787!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8649cde7bf2db199%3A0x8f4d4abd3499a964!2sRedline%20Repairs%20LLC!5e0!3m2!1sen!2sus!4v1779410645325!5m2!1sen!2sus',

};

// ── DEFAULT SERVICES ──────────────────────────────
// Shown when Google Sheets is not configured
const DEFAULT_SERVICES = [
  {
    name: 'Oil Change & Filter',
    description: 'Keep your engine running clean with a full-service oil change. We use quality oil and filters, and perform a complimentary multi-point inspection with every service.',
    imageurl: 'images/pexels-oil-change.jpeg',
  },
  {
    name: 'Brake Repair & Service',
    description: 'From worn brake pads to rotor resurfacing, our mechanics diagnose and fix your brake system right. Don\'t wait — safe stopping is non-negotiable.',
    imageurl: 'images/brakes.webp',
  },
  {
    name: 'Engine Diagnostics',
    description: 'Check engine light on? We use advanced diagnostic tools to pinpoint the exact issue fast, explain it in plain language, and give you an honest repair quote.',
    imageurl: 'images/pexels-engine-diagnostic.jpeg',
  },
  {
    name: 'Tire Rotation & Balancing',
    description: 'Extend the life of your tires and improve fuel economy with regular rotation and balancing. We check tread depth and pressure too.',
    imageurl: 'images/tire-rotation.webp',
  },
  {
    name: 'AC Repair & Recharge',
    description: 'East Texas summers are brutal. We diagnose AC problems, recharge refrigerant, and repair compressors and leaks to keep you cool on the road.',
    imageurl: 'images/air-conditioning-repair.webp',
  },
  {
    name: 'Transmission Service',
    description: 'From fluid flushes to full transmission repairs, we service automatic and manual transmissions. Catch small issues early before they become expensive problems.',
    imageurl: 'images/transmission.webp',
  },
];

// ── DEFAULT REVIEWS ───────────────────────────────
// Shown when Google Sheets is not configured
const DEFAULT_REVIEWS = [
  { author: 'Marcus T.',   rating: 5, date: 'April 2025',    avatar: '', text: `Brought my truck in for a mystery noise — they diagnosed it same day, explained everything clearly, and had it fixed by afternoon. Honest pricing, no surprises. This is my shop from now on.` },
  { author: 'Jennifer R.', rating: 5, date: 'March 2025',    avatar: '', text: `Best auto shop experience I've had in Tyler. They communicated every step of the way and finished ahead of schedule. My car runs like new. Highly recommend!` },
  { author: 'David K.',    rating: 5, date: 'February 2025', avatar: '', text: `Fair prices and fast turnaround. No upselling, just straight talk about what my vehicle actually needed. Refreshing to find a shop you can trust.` },
];
