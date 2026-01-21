# Express + TypeScript + MongoDB Authorization API

A minimal Express server written in TypeScript with dedicated routes for handling user authorization flows and JWT issuance, using MongoDB for user storage.

## Features

- TypeScript-first Express setup with strict type checking.
- MongoDB integration for user authentication.
- `/api/auth/login` route validating credentials against MongoDB and returning a signed JWT with embedded role information.
- `/api/auth/verify` route validating a provided JWT token.
- Role-protected routes at `/api/user/profile` (user role) and `/api/admin/reports` (admin role).
- Helmet, CORS, and JSON body parsing configured out of the box.
- Centralized error handling with typed HTTP errors.
- Health check endpoint at `/api/health`.
- YAML-based configuration.

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+
- MongoDB 3.6+ (tested with 3.6.23)

**Note:** This application uses Mongoose 5.13.x for compatibility with MongoDB 3.6.23. Be aware that this version has known security vulnerabilities. For production use, consider upgrading to MongoDB 4.2+ and Mongoose 8.x.

### Installation

1. Install dependencies:
   ```powershell
   pnpm install
   ```

2. Ensure MongoDB is running and accessible.

3. Create users in MongoDB:
   ```powershell
   pnpm exec ts-node create-users.ts
   ```

   This creates two users:
   - Admin: `admin@example.com` / `Admin123!`
   - User: `user@example.com` / `User123!`

### Configuration

The application uses `appsettings.yml` for configuration. The default configuration includes:

```yaml
Jwt:
  Key: "your-super-secret-key-here-change-in-production"

ConnectionStrings:
  MongoConnection: "mongodb://localhost:27017/express_ts"

Server:
  Urls: "http://localhost:5000;https://localhost:5001"

Cors:
  AllowedOrigins: "http://localhost:3000,http://localhost:3001"
```

**Important:** Change the `Jwt.Key` to a strong secret in production.

### Development

```powershell
pnpm dev
```

The server starts with auto-reload at [http://localhost:5000](http://localhost:5000).

### Production Build

```powershell
pnpm build
pnpm start
```

## Scripts

- `pnpm dev`: Start development server with auto-reload using `ts-node-dev`.
- `pnpm build`: Compile the TypeScript code to JavaScript in the `dist` folder.
- `pnpm start`: Run the compiled production server from the `dist` folder.
- `pnpm lint`: Run linting checks using ESLint and check types.
- `pnpm test`: Run unit tests once using Vitest.
- `pnpm test:watch`: Run unit tests in watch mode using Vitest.

## Project Structure

```text
express_ts/
├── src/                # Source code directory
│   ├── config/         # Configuration logic (database connection, env vars)
│   ├── errors/         # Custom HTTP error classes
│   ├── middleware/     # Express middleware (auth, error handling)
│   ├── models/         # Mongoose models and schemas
│   ├── routes/         # API route definitions
│   ├── types/          # TypeScript custom type definitions
│   ├── app.ts          # Express application configuration
│   └── server.ts       # Main entry point that starts the server
├── tests/              # Test suites and setup files
├── appsettings.yml     # Central configuration file (YAML)
├── create-users.ts     # Script to seed the database with initial users
├── package.json        # Project metadata, dependencies, and scripts
└── tsconfig.json       # Main TypeScript configuration
```

## API

### POST `/api/auth/login`

Request body:

```json
{
  "username": "admin@example.com",
  "password": "Admin123!"
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

### POST `/api/auth/verify`

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
    "sub": "admin@example.com",
    "role": "admin",
    "iat": 0,
    "exp": 0
  }
}
```

### GET `/api/user/profile`

Headers:

- `Authorization: Bearer <jwt>` (token issued to a user role)

Response:

```json
{
  "message": "User profile data",
  "user": {
    "username": "user@example.com",
    "role": "user"
  }
}
```

### GET `/api/admin/reports`

Headers:

- `Authorization: Bearer <jwt>` (token issued to an admin role)

Response:

```json
{
  "message": "Admin dashboard data",
  "user": {
    "username": "admin@example.com",
    "role": "admin"
  }
}
```

## Testing the Endpoints

With the server running, use your preferred HTTP client (Postman, curl, etc.) to send requests. Ensure the `Authorization` header uses `Bearer <token>` for protected routes.

The application supports CORS for the configured origins, allowing frontend applications to make requests from those domains.

## Next Steps

- Update `appsettings.yml` with production values (strong JWT key, production MongoDB connection).
- Add refresh tokens and revoke logic.
- Implement request logging and rate limiting.
- Consider adding user registration endpoints if needed.
- Add input validation and sanitization for enhanced security.
