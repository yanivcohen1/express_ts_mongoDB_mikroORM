# Express + TypeScript Authorization API

A minimal Express server written in TypeScript with dedicated routes for handling user authorization flows and JWT issuance.

## Features

- TypeScript-first Express setup with strict type checking.
- `/auth/login` route validating credentials and returning a signed JWT.
- `/auth/verify` route validating a provided JWT token.
- Helmet and JSON body parsing configured out of the box.
- Centralized error handling with typed HTTP errors.
- Health check endpoint at `/health`.

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

1. Install dependencies:
   ```powershell
   npm install
   ```
2. Copy the example environment file and update values:
   ```powershell
   Copy-Item .env.example .env
   ```
3. Edit `.env` and set a strong `JWT_SECRET`. Optionally override `AUTH_USERNAME` and `AUTH_PASSWORD`.

### Development

```powershell
npm run dev
```

The server starts with auto-reload at [http://localhost:3000](http://localhost:3000).

### Production Build

```powershell
npm run build
npm start
```

## API

### POST `/auth/login`

Request body:

```json
{
  "username": "admin",
  "password": "password"
}
```

Response:

```json
{
  "token": "<jwt>",
  "tokenType": "Bearer",
  "expiresIn": 3600
}
```

### POST `/auth/verify`

Request body:

```json
{
  "token": "<jwt>"
}
```

Response:

```json
{
  "valid": true,
  "payload": {
    "sub": "admin",
    "iat": 0,
    "exp": 0
  }
}
```

## Testing the Endpoints

With the server running, use your preferred HTTP client (Postman, curl, etc.) to send requests. Ensure the `Authorization` header uses `Bearer <token>` if you extend the app with protected routes.

## Next Steps

- Replace demo credential validation with real user storage or identity provider integration.
- Add refresh tokens and revoke logic.
- Implement request logging and rate limiting.
