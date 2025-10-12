# Express + TypeScript Authorization API

A minimal Express server written in TypeScript with dedicated routes for handling user authorization flows and JWT issuance.

## Features

- TypeScript-first Express setup with strict type checking.
- `/auth/login` route validating credentials and returning a signed JWT with embedded role information.
- `/auth/verify` route validating a provided JWT token.
- Role-protected routes at `/user/profile` (user role) and `/admin/dashboard` (admin role).
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
3. Edit `.env` and set a strong `JWT_SECRET`. Optionally override `AUTH_ADMIN_USERNAME` / `AUTH_ADMIN_PASSWORD` and `AUTH_USER_USERNAME` / `AUTH_USER_PASSWORD`.

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
  "expiresIn": 3600,
  "role": "admin"
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
    "role": "admin",
    "iat": 0,
    "exp": 0
  }
}
```

### GET `/user/profile`

Headers:

- `Authorization: Bearer <jwt>` (token issued to a user role)

Response:

```json
{
  "message": "User profile data",
  "user": {
    "username": "user",
    "role": "user"
  }
}
```

### GET `/admin/dashboard`

Headers:

- `Authorization: Bearer <jwt>` (token issued to an admin role)

Response:

```json
{
  "message": "Admin dashboard data",
  "user": {
    "username": "admin",
    "role": "admin"
  }
}
```

## Testing the Endpoints

With the server running, use your preferred HTTP client (Postman, curl, etc.) to send requests. Ensure the `Authorization` header uses `Bearer <token>` if you extend the app with protected routes.

## Next Steps

- Replace demo credential validation with real user storage or identity provider integration.
- Add refresh tokens and revoke logic.
- Implement request logging and rate limiting.
