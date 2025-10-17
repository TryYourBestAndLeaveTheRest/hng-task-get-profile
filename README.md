# Profile API

Simple Node.js/Express API exposing a `/me` endpoint that returns profile info plus a dynamic cat fact fetched from https://catfact.ninja/fact

Requirements implemented:
- GET /me returns JSON with Content-Type: application/json
- Response contains { status, user, timestamp, fact }
- Fetches a fresh cat fact on every request with timeout and fallback

Run locally

1. Install dependencies (you already have express, dotenv, morgan installed). If not:

```bash
npm install
```

2. Create `.env` from the example and set your email/name:

```bash
cp .env.example .env
# edit .env as needed
```

3. Start the server:

```bash
npm start
```

4. Test the endpoint:

```bash
curl -i http://localhost:3000/me
```

You should get a 200 response with JSON in the exact shape required.
