const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const enquiryRoute = require('./routes/enquiry.route');
const { errorHandler } = require('./middleware/errorHandler');
const { rateLimiter } = require('./middleware/rateLimiter');
const { config } = require('./config/env');

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

app.use(express.json({ limit: '100kb' }));

const defaultAllowedOrigins = [
  'https://seqservices.com.au',
  'https://www.seqservices.com.au',
  ...(config.NODE_ENV !== 'production'
    ? ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000']
    : []),
];

const envOrigins = config.API_ORIGIN
  ? config.API_ORIGIN.split(',').map((o) => o.trim()).filter(Boolean)
  : [];

const allowedOrigins = Array.from(new Set([...defaultAllowedOrigins, ...envOrigins]));

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || (config.NODE_ENV !== 'production' && origin.startsWith('http://localhost:'))) {
        return callback(null, true);
      }
      return callback(new Error('Blocked by CORS policy'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(rateLimiter);
app.use('/api/enquiry', enquiryRoute);
app.use(errorHandler);

module.exports = app;
