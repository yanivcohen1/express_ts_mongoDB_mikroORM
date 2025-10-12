import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const AUTH_USERNAME = process.env.AUTH_USERNAME;
const AUTH_PASSWORD = process.env.AUTH_PASSWORD;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required.');
}

export const env = {
  port: Number(process.env.PORT) || 3000,
  jwtSecret: JWT_SECRET,
  authUsername: AUTH_USERNAME,
  authPassword: AUTH_PASSWORD
};
