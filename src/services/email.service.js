const nodemailer = require('nodemailer');
const { config } = require('../config/env');

async function sendEnquiryEmail(payload) {
  const adminEmail = config.EMAIL_TO || 'dilankaheshan859@gmail.com';
  const timestamp = new Date().toLocaleString('en-AU', { timeZone: 'Australia/Brisbane' });

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          /* Base Styles */
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px; color: #333; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
          .header { background-color: #0052CC !important; background: linear-gradient(135deg, #0052CC 0%, #003d99 100%); padding: 30px 24px; text-align: center; color: #ffffff !important; }
          .header h1 { margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px; color: #ffffff !important; }
          .header p { margin: 6px 0 0 0; font-size: 14px; opacity: 0.9; color: #ffffff !important; }
          .badge { display: inline-block; background-color: rgba(255,255,255,0.2) !important; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-top: 10px; color: #ffffff !important; }
          .content { padding: 30px 24px; }
          .section-title { font-size: 13px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px; margin-bottom: 12px; }
          .info-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
          .info-table td { padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
          .info-table td.label { font-weight: 600; color: #475569; width: 140px; }
          .info-table td.value { color: #0f172a; font-weight: 500; }
          .message-box { background: #f8fafc; border-left: 4px solid #0052CC; padding: 16px; border-radius: 8px; font-size: 14px; color: #334155; line-height: 1.6; white-space: pre-wrap; }
          .footer { background: #f8fafc; padding: 16px 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
          .action-btn { display: inline-block; background: #0052CC; color: #ffffff !important; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 600; margin-top: 20px; text-align: center; }
          
          /* Dark Mode Fallbacks */
          @media (prefers-color-scheme: dark) {
            body { background-color: #0f172a !important; color: #f8fafc !important; }
            .container { background-color: #1e293b !important; border-color: #334155 !important; }
            .header { background-color: #0052CC !important; }
            .info-table td.label { color: #cbd5e1 !important; }
            .info-table td.value { color: #f8fafc !important; }
            .info-table td { border-bottom-color: #334155 !important; }
            .message-box { background-color: #0f172a !important; color: #e2e8f0 !important; }
            .footer { background-color: #0f172a !important; border-top-color: #334155 !important; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header" style="background-color: #0052CC; text-align: center; padding: 30px 24px;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700;">New Quotation Request</h1>
            <p style="color: #ffffff; margin: 6px 0 0 0; font-size: 14px;">SEQ Services Web Application</p>
            <div class="badge" style="color: #ffffff; background-color: #3377db; padding: 4px 12px; border-radius: 20px; display: inline-block; margin-top: 10px; font-size: 12px; font-weight: 600;">${timestamp} AEST</div>
          </div>
          <div class="content">
            <div class="section-title">Client Details</div>
            <table class="info-table">
              <tr>
                <td class="label">Client Name</td>
                <td class="value">${escapeHtml(payload.name || '')}</td>
              </tr>
              ${payload.companyName ? `
              <tr>
                <td class="label">Company Name</td>
                <td class="value">${escapeHtml(payload.companyName)}</td>
              </tr>` : ''}
              <tr>
                <td class="label">Email Address</td>
                <td class="value"><a href="mailto:${escapeHtml(payload.email || '')}" style="color: #0052CC;">${escapeHtml(payload.email || '')}</a></td>
              </tr>
              <tr>
                <td class="label">Phone Number</td>
                <td class="value"><a href="tel:${escapeHtml(payload.phone || '')}" style="color: #0052CC;">${escapeHtml(payload.phone || '')}</a></td>
              </tr>
              <tr>
                <td class="label">Site Location</td>
                <td class="value">${escapeHtml(payload.location || '')}</td>
              </tr>
              ${payload.serviceCategory ? `
              <tr>
                <td class="label">Service Category</td>
                <td class="value">${escapeHtml(payload.serviceCategory)}</td>
              </tr>` : ''}
              <tr>
                <td class="label">Service Required</td>
                <td class="value"><strong>${escapeHtml(payload.serviceRequired || '')}</strong></td>
              </tr>
            </table>

            <div class="section-title">Quotation Details / Message</div>
            <div class="message-box">${escapeHtml(payload.message || '')}</div>

            <div style="text-align: center;">
              <a href="mailto:${escapeHtml(payload.email || '')}?subject=Re:%20SEQ%20Services%20Quotation%20-%20${encodeURIComponent(payload.serviceRequired || '')}" class="action-btn">Reply to Customer (${escapeHtml(payload.email || '')})</a>
            </div>
          </div>
          <div class="footer">
            This message was generated from your SEQ Services website quotation form.<br>
            Target Admin Email: ${adminEmail}
          </div>
        </div>
      </body>
    </html>
  `;

  // Check if SMTP is configured
  if (!config.SMTP_HOST || !config.SMTP_USER) {
    console.log('----------------------------------------------------');
    console.log(`[DEV MODE] Email to Admin (${adminEmail}):`);
    console.log(`Subject: New Quotation Request - ${payload.serviceRequired}`);
    console.log(`From: ${payload.name} (${payload.email})`);
    console.log(`Company: ${payload.companyName || 'N/A'}`);
    console.log(`Phone: ${payload.phone}`);
    console.log(`Location: ${payload.location}`);
    console.log(`Category: ${payload.serviceCategory || 'N/A'}`);
    console.log(`Service Required: ${payload.serviceRequired}`);
    console.log(`Message: ${payload.message}`);
    console.log('----------------------------------------------------');
    console.log('NOTE: To send live emails, configure SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS in backend/.env');
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      family: 4,
      auth: {
        user: process.env.SMTP_USER || config.SMTP_USER,
        pass: (process.env.SMTP_PASS || config.SMTP_PASS).replace(/\s+/g, ''),
      },
    });

    await transporter.sendMail({
      from: config.EMAIL_FROM,
      to: adminEmail,
      replyTo: payload.email,
      subject: `New Quotation Request: ${payload.serviceRequired} - ${payload.name}`,
      html,
    });
  } catch (err) {
    console.error('SMTP Email sending failed:', err?.message || err);
    console.log('----------------------------------------------------');
    console.log(`[ENQUIRY BACKUP LOG] Saved Quotation Request for Admin (${adminEmail}):`);
    console.log(`From: ${payload.name} (${payload.email})`);
    console.log(`Phone: ${payload.phone}`);
    console.log(`Location: ${payload.location}`);
    console.log(`Service Required: ${payload.serviceRequired}`);
    console.log(`Message: ${payload.message}`);
    console.log('----------------------------------------------------');
  }
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

module.exports = { sendEnquiryEmail };
