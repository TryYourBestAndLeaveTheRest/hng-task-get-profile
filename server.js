import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { fetchWithTimeout } from './helper/apiCall.js';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiting middleware to all requests
app.use(limiter)

// Basic logging
app.use(morgan(process.env.LOG_FORMAT || 'dev'));

// Helper: fetch with timeout using AbortController

app.get('/me', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  const user = {
    email: 'sherifdeenraji96@gmail.com',
    name: 'Raji Sherifdeen Ayinla',
    stack: 'Node.js/Express'
  };

  const timestamp = new Date().toISOString();

  // Fetch cat fact
  const catFactUrl = 'https://catfact.ninja/fact';
  let fact = null;

  try {
    const response = await fetchWithTimeout(catFactUrl);
    if (!response.ok) throw new Error(`Cat facts API returned ${response.status}`);
    const data = await response.json();
    fact = data?.fact || 'Cats are mysterious.';
  } catch (err) {
    console.error('Failed to fetch cat fact:', err.message || err);
    // Fallback message
    fact = 'Could not fetch a cat fact at this time.';
  }

  const payload = {
    status: 'success',
    user,
    timestamp,
    fact
  };

  res.status(200).json(payload);
});

// Basic health check
app.get('/', (req, res) => res.send('OK'));

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
