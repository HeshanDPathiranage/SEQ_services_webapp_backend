const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const enquiryRoute = require('./routes/enquiry.route');
const { errorHandler } = require('./middleware/errorHandler');
const { rateLimiter } = require('./middleware/rateLimiter');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(helmet());
app.use(express.json());

// CORS configuration using process.env.API_ORIGIN
const apiOrigin = process.env.API_ORIGIN;
const originOption = apiOrigin
  ? (apiOrigin.includes(',') ? apiOrigin.split(',').map(o => o.trim()) : apiOrigin)
  : '*';

app.use(cors({
  origin: originOption,
  credentials: true
}));

app.use(rateLimiter);
app.use('/api/enquiry', enquiryRoute);
app.use(errorHandler);

module.exports = app;
