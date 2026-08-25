const nodemailer = require('nodemailer');
const { config } = require('../config/env');

async function sendEnquiryEmail(payload) {
  const adminEmail = config.EMAIL_TO || 'admin@seqservices.com.au';
  const timestamp = new Date().toLocaleString('en-AU', { timeZone: 'Australia/Brisbane' });

  const textBody = `
New Quotation Request - SEQ Services
====================================
Timestamp: ${timestamp} AEST

Client Details:
- Name: ${payload.name}
${payload.companyName ? `- Company: ${payload.companyName}\n` : ''}- Email: ${payload.email}
- Phone: ${payload.phone}
- Location: ${payload.location}
${payload.serviceCategory ? `- Category: ${payload.serviceCategory}\n` : ''}- Service Required: ${payload.serviceRequired}

Message / Requirements:
${payload.message}

------------------------------------
Reply to customer: ${payload.email}
  `.trim();

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="color-scheme" content="light dark">
        <meta name="supported-color-schemes" content="light dark">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px; color: #333333; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
          .header { background-color: #0052CC !important; background: linear-gradient(135deg, #0052CC 0%, #003d99 100%); padding: 30px 24px; text-align: center; color: #ffffff !important; }
          .header h1 { margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px; color: #ffffff !important; }
          .header p { margin: 6px 0 0 0; font-size: 14px; opacity: 0.9; color: #ffffff !important; }
          .badge { display: inline-block; background-color: #003d99 !important; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-top: 10px; color: #ffffff !important; }
          .content { padding: 30px 24px; background-color: #ffffff; color: #333333; }
          .section-title { font-size: 13px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px; margin-bottom: 12px; }
          .info-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; color: #333333; }
          .info-table td { padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #333333; }
          .info-table td.label { font-weight: 600; color: #475569; width: 140px; }
          .info-table td.value { color: #0f172a; font-weight: 500; }
          .message-box { background-color: #f8fafc; border-left: 4px solid #0052CC; padding: 16px; border-radius: 8px; font-size: 14px; color: #334155; line-height: 1.6; white-space: pre-wrap; }
          .footer { background-color: #f8fafc; padding: 16px 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
          .action-btn { display: inline-block; background-color: #0052CC; color: #ffffff !important; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 600; margin-top: 20px; text-align: center; }
          
          /* Dark Mode Styles */
          @media (prefers-color-scheme: dark) {
            body { background-color: #121212 !important; color: #ffffff !important; }
            .container { background-color: #1e1e1e !important; border-color: #333333 !important; }
            .content { background-color: #1e1e1e !important; color: #ffffff !important; }
            .section-title { color: #a1a1aa !important; }
            .info-table { color: #ffffff !important; }
            .info-table td { border-bottom-color: #333333 !important; color: #ffffff !important; }
            .info-table td.label { color: #a1a1aa !important; }
            .info-table td.value { color: #ffffff !important; }
            .message-box { background-color: #2d2d2d !important; color: #e4e4e7 !important; border-left-color: #3b82f6 !important; }
            .footer { background-color: #121212 !important; color: #a1a1aa !important; border-top-color: #333333 !important; }
          }
        </style>
      </head>
      <body style="background-color: #f4f6f9; color: #333333; margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <div class="container" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
          <div class="header" style="background-color: #0052CC; padding: 30px 24px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px; color: #ffffff;">New Quotation Request</h1>
            <p style="margin: 6px 0 0 0; font-size: 14px; opacity: 0.9; color: #ffffff;">SEQ Services Web Application</p>
            <div class="badge" style="display: inline-block; background-color: #003d99; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-top: 10px; color: #ffffff;">${timestamp} AEST</div>
          </div>
          <div class="content" style="padding: 30px 24px; background-color: #ffffff; color: #333333;">
            <div class="section-title" style="font-size: 13px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px; margin-bottom: 12px;">Client Details</div>
            <table class="info-table" style="width: 100%; border-collapse: collapse; margin-bottom: 24px; color: #333333;">
              <tr>
                <td class="label" style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; font-weight: 600; color: #475569; width: 140px;">Client Name</td>
                <td class="value" style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #0f172a; font-weight: 500;">${escapeHtml(payload.name)}</td>
              </tr>
              ${payload.companyName ? `
              <tr>
                <td class="label" style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; font-weight: 600; color: #475569; width: 140px;">Company Name</td>
                <td class="value" style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #0f172a; font-weight: 500;">${escapeHtml(payload.companyName)}</td>
              </tr>` : ''}
              <tr>
                <td class="label" style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; font-weight: 600; color: #475569; width: 140px;">Email Address</td>
                <td class="value" style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #0f172a; font-weight: 500;"><a href="mailto:${escapeHtml(payload.email)}" style="color: #0052CC;">${escapeHtml(payload.email)}</a></td>
              </tr>
              <tr>
                <td class="label" style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; font-weight: 600; color: #475569; width: 140px;">Phone Number</td>
                <td class="value" style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #0f172a; font-weight: 500;"><a href="tel:${escapeHtml(payload.phone)}" style="color: #0052CC;">${escapeHtml(payload.phone)}</a></td>
              </tr>
              <tr>
                <td class="label" style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; font-weight: 600; color: #475569; width: 140px;">Site Location</td>
                <td class="value" style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #0f172a; font-weight: 500;">${escapeHtml(payload.location)}</td>
              </tr>
              ${payload.serviceCategory ? `
              <tr>
                <td class="label" style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; font-weight: 600; color: #475569; width: 140px;">Service Category</td>
                <td class="value" style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #0f172a; font-weight: 500;">${escapeHtml(payload.serviceCategory)}</td>
              </tr>` : ''}
              <tr>
                <td class="label" style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; font-weight: 600; color: #475569; width: 140px;">Service Required</td>
                <td class="value" style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #0f172a; font-weight: 500;"><strong>${escapeHtml(payload.serviceRequired)}</strong></td>
              </tr>
            </table>
            <div class="section-title" style="font-size: 13px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px; margin-bottom: 12px;">Quotation Details / Message</div>
            <div class="message-box" style="background-color: #f8fafc; border-left: 4px solid #0052CC; padding: 16px; border-radius: 8px; font-size: 14px; color: #334155; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(payload.message)}</div>
            <div style="text-align: center;">
              <a href="mailto:${escapeHtml(payload.email)}?subject=Re:%20SEQ%20Services%20Quotation%20-%20${encodeURIComponent(payload.serviceRequired)}" class="action-btn" style="display: inline-block; background-color: #0052CC; color: #ffffff !important; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 600; margin-top: 20px; text-align: center;">Reply to Customer (${escapeHtml(payload.email)})</a>
            </div>
          </div>
          <div class="footer" style="background-color: #f8fafc; padding: 16px 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9;">
            This message was generated from your SEQ Services website quotation form.
          </div>
        </div>
      </body>
    </html>
  `;

  // Check if SMTP is configured
  if (!config.SMTP_HOST || !config.SMTP_USER) {
    if (config.NODE_ENV !== 'production') {
      console.log('----------------------------------------------------');
      console.log(`[DEV MODE] Email to Admin (${adminEmail}):`);
      console.log(`Subject: New Quotation Request - ${payload.serviceRequired}`);
      console.log(`Service Required: ${payload.serviceRequired}`);
      console.log('----------------------------------------------------');
      console.log('NOTE: To send live emails, configure SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS in backend environment.');
    }
    return;
  }

  try {
    const isSecurePort = config.SMTP_PORT === 465;
    const transporter = nodemailer.createTransport({
      host: config.SMTP_HOST || 'smtp.gmail.com',
      port: config.SMTP_PORT || 587,
      secure: isSecurePort,
      family: 4,
      auth: {
        user: config.SMTP_USER,
        pass: config.SMTP_PASS.replace(/\s+/g, ''),
      },
    });

    await transporter.sendMail({
      from: config.EMAIL_FROM,
      to: adminEmail,
      replyTo: payload.email,
      subject: `New Quotation Request: ${payload.serviceRequired} - ${payload.name}`,
      text: textBody,
      html,
    });
  } catch (err) {
    if (config.NODE_ENV !== 'production') {
      console.error('SMTP Email sending failed:', err?.message || err);
    } else {
      console.error('SMTP Email sending failed.');
    }
    throw new Error('Email delivery failed.');
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
