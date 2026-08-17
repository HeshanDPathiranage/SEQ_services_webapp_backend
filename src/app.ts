import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import enquiryRoute from './routes/enquiry.route';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(helmet());
app.use(express.json());

// CORS configuration using process.env.API_ORIGIN (supports single origin or comma-separated origins)
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

export default app;
