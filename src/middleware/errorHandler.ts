import { ErrorRequestHandler } from 'express';
import { config } from '../config/env';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (config.NODE_ENV !== 'production') {
    console.error('[Unhandled Error]:', err);
  } else {
    console.error('[Error]:', err?.message || 'Internal error');
  }

  res.status(500).json({ 
    message: 'Internal server error. Please try again later.' 
  });
};
