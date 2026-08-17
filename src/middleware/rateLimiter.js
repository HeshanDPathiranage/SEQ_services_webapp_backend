const ipRequests = new Map();
const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 10;

function rateLimiter(req, res, next) {
  if (req.method !== 'POST') {
    return next();
  }

  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const entry = ipRequests.get(ip) || { count: 0, reset: now + WINDOW_MS };

  if (now > entry.reset) {
    entry.count = 0;
    entry.reset = now + WINDOW_MS;
  }

  entry.count += 1;

  if (entry.count > MAX_REQUESTS) {
    return res.status(429).json({ message: 'Too many requests. Please try again later.' });
  }

  ipRequests.set(ip, entry);
  next();
}

module.exports = { rateLimiter };
