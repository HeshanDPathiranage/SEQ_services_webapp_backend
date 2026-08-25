const { sendEnquiryEmail } = require('../services/email.service');
const { config } = require('../config/env');

async function handleEnquiry(req, res, next) {
  try {
    const payload = req.body;
    const secretKey = config.RECAPTCHA_SECRET_KEY;

    if (payload.recaptchaToken && secretKey) {
      try {
        const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${encodeURIComponent(payload.recaptchaToken)}`;
        const verifyRes = await fetch(verifyUrl, { method: 'POST' });
        const verifyData = await verifyRes.json();
        if (!verifyData.success) {
          if (config.NODE_ENV !== 'production') {
            console.warn('reCAPTCHA verification failed:', verifyData['error-codes']);
          }
        }
      } catch (err) {
        if (config.NODE_ENV !== 'production') {
          console.error('reCAPTCHA verification check error:', err);
        }
      }
    }

    await sendEnquiryEmail(payload);
    res.status(200).json({ message: 'Enquiry sent successfully.' });
  } catch (error) {
    next(error);
  }
}

module.exports = { handleEnquiry };
