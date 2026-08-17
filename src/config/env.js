const dotenv = require('dotenv');

dotenv.config();

const config = {
  PORT: process.env.PORT ? Number(process.env.PORT) : 4000,
  API_ORIGIN: process.env.API_ORIGIN || 'http://localhost:3000',
  EMAIL_FROM: process.env.EMAIL_FROM || 'SEQ Services Quotations <contact@seqservices.com.au>',
  EMAIL_TO: process.env.EMAIL_TO || 'dilankaheshan859@gmail.com',
  SMTP_HOST: process.env.SMTP_HOST || '',
  SMTP_PORT: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY || '',
};

module.exports = { config };
