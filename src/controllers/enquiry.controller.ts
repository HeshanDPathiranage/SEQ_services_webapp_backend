import { Request, Response, NextFunction } from 'express';
import { sendEnquiryEmail } from '../services/email.service';
import { EnquiryPayload } from '../types/enquiry.types';

export async function handleEnquiry(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = req.body as EnquiryPayload & { recaptchaToken?: string };

    const secretKey = process.env.RECAPTCHA_SECRET_KEY || '6LdbunMtAAAAAIm-k-OutYTA71Q0UnpI_rZ-MO8F';
    if (payload.recaptchaToken && secretKey) {
      try {
        const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${encodeURIComponent(payload.recaptchaToken)}`;
        const verifyRes = await fetch(verifyUrl, { method: 'POST' });
        const verifyData = (await verifyRes.json()) as { success: boolean; 'error-codes'?: string[] };
        if (!verifyData.success) {
          console.warn('reCAPTCHA verification result:', verifyData['error-codes']);
        }
      } catch (err) {
        console.error('reCAPTCHA verification check error:', err);
      }
    }

    await sendEnquiryEmail(payload);
    res.status(200).json({ message: 'Enquiry sent successfully.' });
  } catch (error) {
    next(error);
  }
}
