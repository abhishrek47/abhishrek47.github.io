// ─────────────────────────────────────────────────────────────
//  daily-digest.js
//  Runs once a day via GitHub Actions.
//  Checks Firestore for new newsletter subscribers in the last
//  24 hours. If any exist, sends a digest email to Abhishek.
//  If zero new subscribers — exits silently, no email.
// ─────────────────────────────────────────────────────────────

const admin      = require('firebase-admin');
const nodemailer = require('nodemailer');

async function run() {

  // ── 1. Firebase init from GitHub Secret ──────────────────
  let serviceAccount;
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } catch (e) {
    console.error('❌ FIREBASE_SERVICE_ACCOUNT secret is missing or invalid JSON.');
    process.exit(1);
  }

  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  const db = admin.firestore();

  // ── 2. Query new subscribers in last 24 hours ─────────────
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  console.log(`🔍 Checking for subscribers since: ${since}`);

  const snapshot = await db.collection('newsletter_subscribers')
    .where('active', '==', true)
    .where('subscribed', '>=', since)
    .orderBy('subscribed', 'desc')
    .get();

  if (snapshot.empty) {
    console.log('✓ No new subscribers in the last 24 hours. Nothing to send.');
    process.exit(0);
  }

  const newSubs = snapshot.docs.map(doc => doc.data());
  console.log(`📬 ${newSubs.length} new subscriber(s) found.`);

  // ── 3. Build digest email ─────────────────────────────────
  const count    = newSubs.length;
  const subject  = `📬 ${count} new subscriber${count > 1 ? 's' : ''} — The Hard Part`;

  const rowsHTML = newSubs.map(s => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #f0ebe5;">
        <table width="100%" cellpadding="0" cellspacing="0"><tr>
          <td style="font-family:Arial,sans-serif;font-size:14px;color:#1a1a1a;font-weight:600;">
            <a href="mailto:${s.email}" style="color:#1a1a1a;text-decoration:none;font-weight:600;">${s.email}</a>
          </td>
          <td align="right" style="font-family:'Courier New',monospace;font-size:11px;color:#c0392b;letter-spacing:1px;text-transform:uppercase;">
            ${s.source || 'unknown'}
          </td>
        </tr></table>
        <p style="margin:3px 0 0;font-family:'Courier New',monospace;font-size:10px;color:#999;">
          ${new Date(s.subscribed).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' })} IST
        </p>
      </td>
    </tr>`).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f0eb;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f5f0eb;">
<tr><td align="center" style="padding:32px 16px 48px;">
<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

  <!-- HEADER -->
  <tr><td style="background-color:#1e3a5f;border-radius:16px 16px 0 0;padding:32px 40px 28px;">
    <table width="100%" cellpadding="0" cellspacing="0"><tr>
      <td>
        <p style="margin:0 0 6px;font-family:'Courier New',monospace;font-size:10px;color:rgba(255,255,255,0.5);letter-spacing:3px;text-transform:uppercase;">The Hard Part · Digest</p>
        <h1 style="margin:0;font-family:Georgia,serif;font-size:26px;color:#ffffff;font-weight:800;line-height:1.2;">
          ${count} new subscriber${count > 1 ? 's' : ''}
        </h1>
      </td>
      <td align="right" style="vertical-align:top;">
        <div style="background:#c0392b;border-radius:50%;width:52px;height:52px;line-height:52px;text-align:center;display:inline-block;vertical-align:middle;">
          <span style="font-family:Georgia,serif;font-size:22px;color:#fff;font-weight:800;line-height:52px;">${count}</span>
        </div>
      </td>
    </tr></table>
  </td></tr>

  <!-- BODY -->
  <tr><td style="background:#ffffff;padding:32px 40px;">
    <p style="margin:0 0 6px;font-family:'Courier New',monospace;font-size:10px;color:#c0392b;letter-spacing:3px;text-transform:uppercase;">New in the last 24 hours</p>
    <table width="100%" cellpadding="0" cellspacing="0">
      ${rowsHTML}
    </table>
  </td></tr>

  <!-- FOOTER -->
  <tr><td style="background:#1e3a5f;border-radius:0 0 16px 16px;padding:20px 40px;">
    <p style="margin:0;font-family:'Courier New',monospace;font-size:10px;color:rgba(255,255,255,0.4);">
      Sent automatically by GitHub Actions · abhishektrivedi.com
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

  // ── 4. Send via Gmail ─────────────────────────────────────
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    }
  });

  await transporter.sendMail({
    from:    `"The Hard Part · Digest" <${process.env.GMAIL_USER}>`,
    to:      process.env.GMAIL_USER,
    subject: subject,
    html:    html,
  });

  console.log(`✅ Digest sent — ${count} new subscriber(s) listed.`);
  process.exit(0);
}

run().catch(err => {
  console.error('❌ Fatal:', err.message);
  process.exit(1);
});
