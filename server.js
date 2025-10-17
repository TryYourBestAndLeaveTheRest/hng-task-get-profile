import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Basic logging
app.use(morgan(process.env.LOG_FORMAT || 'dev'));

// Helper: fetch with timeout using AbortController
async function fetchWithTimeout(url, options = {}, timeout = 3000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { signal: controller.signal, ...options });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

app.get('/me', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  const user = {
    email: process.env.USER_EMAIL || 'you@example.com',
    name: process.env.USER_NAME || 'Your Name',
    stack: process.env.USER_STACK || 'Node.js/Express'
  };

  const timestamp = new Date().toISOString();

  // Fetch cat fact
  const catFactUrl = 'https://catfact.ninja/fact';
  let fact = null;

  try {
    const response = await fetchWithTimeout(catFactUrl, {}, Number(process.env.CATFACT_TIMEOUT_MS) || 3000);
    if (!response.ok) throw new Error(`Cat facts API returned ${response.status}`);
    const data = await response.json();
    fact = data?.fact || 'Cats are mysterious.';
  } catch (err) {
    console.error('Failed to fetch cat fact:', err.message || err);
    // Fallback message
    fact = process.env.CATFACT_FALLBACK || 'Could not fetch a cat fact at this time.';
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
