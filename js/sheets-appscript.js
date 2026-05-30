/**
 * =====================================================
 *  GOOGLE APPS SCRIPT — Contact Form Handler
 *  Paste this entire file into the Apps Script editor.
 *
 *  Setup:
 *    1. Open your Google Sheet
 *    2. Extensions → Apps Script
 *    3. Paste this code (replace any existing code)
 *    4. Click "Deploy" → "New deployment"
 *    5. Type: Web app
 *       Execute as: Me
 *       Who has access: Anyone
 *    6. Click Deploy → copy the Web App URL
 *    7. Paste that URL into js/config.js → sheets.formWebAppUrl
 *
 *  Sheet tabs expected:
 *    "Inquiries"  — form submissions land here
 *    "Services"   — manually maintained service listings
 *    "Reviews"    — curated Google review list
 *  * =====================================================
 */

// Replace with your actual email to get notifications
const NOTIFY_EMAIL = 'redlinerepairsllc@icloud.com';

/**
 * Handles POST from the contact form.
 * The site sends JSON via fetch with mode:'no-cors'.
 */
// Minimum milliseconds between submissions from the same email (5 minutes)
const RATE_LIMIT_MS = 5 * 60 * 1000;

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // Server-side honeypot check — silently succeed to avoid tipping off bots
    if (data.website) {
      Logger.log('Honeypot triggered — bot submission blocked.');
      return ContentService
        .createTextOutput(JSON.stringify({ success: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Rate limit: reject if same email submitted within the last 5 minutes
    if (isRateLimited(data.email)) {
      Logger.log('Rate limit triggered for: ' + data.email);
      return ContentService
        .createTextOutput(JSON.stringify({ success: false, error: 'Too many requests.' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    appendToInquiries(data);
    sendNotificationEmail(data);
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    Logger.log('doPost error: ' + err.message);
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Returns true if the given email has submitted within the last RATE_LIMIT_MS.
 * Checks the Inquiries sheet for a recent matching email row.
 */
function isRateLimited(email) {
  if (!email) return false;
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Inquiries');
    if (!sheet || sheet.getLastRow() < 2) return false;
    const now = Date.now();
    // Read timestamp (col 1) and email (col 3) for all rows
    const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 3).getValues();
    return data.some(row => {
      const rowEmail = String(row[2]).trim().toLowerCase();
      const rowTime  = new Date(row[0]).getTime();
      return rowEmail === email.trim().toLowerCase() && (now - rowTime) < RATE_LIMIT_MS;
    });
  } catch (err) {
    Logger.log('isRateLimited error: ' + err.message);
    return false;
  }
}

/**
 * Handles GET requests (optional — useful for testing the endpoint).
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'Redline Repairs form endpoint is live.' }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Writes a new row to the "Inquiries" sheet tab.
 * Creates the sheet + header row if it doesn't exist.
 */
function appendToInquiries(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Inquiries');

  if (!sheet) {
    sheet = ss.insertSheet('Inquiries');
    sheet.appendRow(['Timestamp', 'Name', 'Email', 'Phone', 'Subject', 'Message', 'Status']);
    // Freeze the header row
    sheet.setFrozenRows(1);
    // Bold the header
    sheet.getRange(1, 1, 1, 7).setFontWeight('bold');
  }

  sheet.appendRow([
    data.timestamp || new Date().toISOString(),
    data.name    || '',
    data.email   || '',
    data.phone   || '',
    data.subject || '',
    data.message || '',
    'new',
  ]);
}

/**
 * Sends a notification email to the shop when a new inquiry arrives.
 * Remove this function or leave NOTIFY_EMAIL blank to disable.
 */
function sendNotificationEmail(data) {
  if (!NOTIFY_EMAIL) return;
  try {
    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: `New Website Inquiry: ${data.subject || 'General'}`,
      body: [
        `You have a new inquiry from your website.`,
        ``,
        `Name:    ${data.name}`,
        `Email:   ${data.email}`,
        `Phone:   ${data.phone || 'Not provided'}`,
        `Subject: ${data.subject}`,
        ``,
        `Message:`,
        data.message,
        ``,
        `Received: ${new Date().toLocaleString()}`,
      ].join('\n'),
    });
  } catch (err) {
    Logger.log('Email send failed: ' + err.message);
  }
}

/**
 * TEST FUNCTION — run manually from the Apps Script editor to verify setup.
 * Click the ▶ Run button while this function is selected.
 */
function testSetup() {
  const testData = {
    timestamp: new Date().toISOString(),
    name: 'Test User',
    email: 'test@example.com',
    phone: '(555) 000-0000',
    subject: 'General Inquiry',
    message: 'This is a test submission from the Apps Script test function.',
  };
  appendToInquiries(testData);
  Logger.log('Test row added to Inquiries sheet successfully.');
}
