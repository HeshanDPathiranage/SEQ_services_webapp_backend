import { Request, Response, NextFunction } from 'express';
import { sendEnquiryEmail } from '../services/email.service';
import { EnquiryPayload } from '../types/enquiry.types';
import { config } from '../config/env';

export async function handleEnquiry(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = req.body as EnquiryPayload & { recaptchaToken?: string };
    const secretKey = config.RECAPTCHA_SECRET_KEY;

    if (payload.recaptchaToken && secretKey) {
      try {
        const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${encodeURIComponent(payload.recaptchaToken)}`;
        const verifyRes = await fetch(verifyUrl, { method: 'POST' });
        const verifyData = (await verifyRes.json()) as { success: boolean; 'error-codes'?: string[] };
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
