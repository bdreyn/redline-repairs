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
    address: '6252 Rhones Quarter Rd # 2B\nTyler, Texas 75707',
    hours: {
      mon_fri:   '9:00 AM – 6:00 PM',
      saturday:  'Appointment Only',
      sunday:    'Closed',
    },
    social: {
      facebook:  '',   // full URL e.g. https://facebook.com/yourpage
      instagram: '',
      twitter:   '',
    },
  },

  // ── GOOGLE APIs ───────────────────────────────────
  // Get keys at: https://console.cloud.google.com/
  // Required scopes: Maps JavaScript API, Places API (read-only)
  // Restrict keys to your GitHub Pages domain for security.
google: {
    mapEmbedUrl:  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3373.1770729676596!2d-95.26384802371042!3d32.28021690920787!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8649cde7bf2db199%3A0x8f4d4abd3499a964!2sRedline%20Repairs%20LLC!5e0!3m2!1sen!2sus!4v1779410645325!5m2!1sen!2sus',
    placeId:     'ChIJmbEtv-fNSYYRZKmZNL1KTY8',  // Google Maps Place ID
    mapCenter:   { lat: 32.28036657487671, lng: -95.26082249212608 },
  },

  // ── SQUARE BOOKING ────────────────────────────────
  // Get your booking URL from:
  //   Square Dashboard → Appointments → Online Booking → Share
  // It looks like: https://squareup.com/appointments/buyer/widget/...
  square: {
    bookingUrl: '',  // Paste your Square booking URL here
  },

  // ── GOOGLE SHEETS BACKEND ────────────────────────
  // See README.md for full setup instructions.
  //
  // SHEET STRUCTURE REQUIRED (tab names matter):
  //   Sheet 1 — "Services"  : columns → name | description | imageUrl | order | visible
  //   Sheet 2 — "Reviews"   : columns → author | rating | text | date | avatar | visible
  //   Sheet 3 — "Inquiries" : columns → timestamp | name | email | phone | subject | message
  //   Sheet 4 — "Mission"   : columns → heading | paragraph
  //
  // To receive contact form submissions via Google Sheets:
  //   1. Open your Sheet → Extensions → Apps Script
  //   2. Paste the script from js/sheets-appscript.js
  //   3. Deploy as Web App (Execute as: Me, Who has access: Anyone)
  //   4. Copy the Web App URL into formWebAppUrl below
  sheets: {
    // Published CSV URLs (File → Share → Publish to web → CSV)
    // Leave empty to use built-in defaults (no Sheet needed)
    servicesUrl:  '',  // Published CSV URL for Services tab
    reviewsUrl:   '',  // Published CSV URL for Reviews tab
    missionUrl:   '',  // Published CSV URL for Mission tab

    // Google Apps Script Web App URL for form submissions
    // (handles the Inquiries sheet writes)
    formWebAppUrl: '',
  },

  // ── MAP EMBED FALLBACK ─────────────────────────────
  // If Google Maps API key is empty, an embed iframe is used instead.
  // Replace with your own embed URL from Google Maps → Share → Embed.
  mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3356.2!2d-95.260822!3d32.280366!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x86397cfdbf2d9b99%3A0x8f4d4abd9e9999!2s6252+Rhones+Quarter+Rd%2C+Tyler%2C+TX+75707!5e0!3m2!1sen!2sus!4v1',

};

// Default services (shown if Google Sheets not configured)
const DEFAULT_SERVICES = [
  { name: 'Oil Change', description: 'Full synthetic oil change with filter replacement and multi-point inspection.', imageUrl: 'https://images.pexels.com/photos/4489702/pexels-photo-4489702.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { name: 'Brake Service', description: 'Complete brake inspection, pad replacement, and rotor resurfacing.', imageUrl: 'https://images.pexels.com/photos/13065690/pexels-photo-13065690.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { name: 'Tire Rotation', description: 'Tire rotation and balance with pressure check and tread assessment.', imageUrl: 'https://images.pexels.com/photos/13065688/pexels-photo-13065688.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { name: 'Engine Diagnostics', description: 'Complete computer diagnostic scan with detailed report and recommendations.', imageUrl: 'https://images.pexels.com/photos/3807277/pexels-photo-3807277.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { name: 'AC Service', description: 'Air conditioning recharge, leak check, and performance testing.', imageUrl: 'https://images.pexels.com/photos/4489737/pexels-photo-4489737.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { name: 'Transmission Service', description: 'Transmission fluid flush and filter replacement to extend drivetrain life.', imageUrl: 'https://images.pexels.com/photos/279949/pexels-photo-279949.jpeg?auto=compress&cs=tinysrgb&w=800' },
];

// Default reviews (shown if Google Sheets not configured)
const DEFAULT_REVIEWS = [
  { author: 'Marcus T.', rating: 5, text: 'Brought my truck in for a mystery noise — they diagnosed it same day, explained everything clearly, and had it fixed by afternoon. Honest pricing, no surprises. This is my shop from now on.', date: 'April 2025', avatar: '' },
  { author: 'Jennifer R.', rating: 5, text: 'Best auto shop experience I`'`ve had in Tyler. They communicated every step of the way and finished ahead of schedule. My car runs like new. Highly recommend!', date: 'March 2025', avatar: '' },
  { author: 'David K.', rating: 5, text: 'Fair prices and fast turnaround. No upselling, just straight talk about what my vehicle actually needed. Refreshing to find a shop you can trust.', date: 'February 2025', avatar: '' },
];
