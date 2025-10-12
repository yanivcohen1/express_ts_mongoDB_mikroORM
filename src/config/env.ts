import dotenv from 'dotenv';

dotenv.config();

export type UserRole = 'admin' | 'user';

export interface CredentialDefinition {
  username: string;
  password: string;
  role: UserRole;
}

const JWT_SECRET = process.env.JWT_SECRET;

const ADMIN_USERNAME = process.env.AUTH_ADMIN_USERNAME ?? process.env.AUTH_USERNAME;
const ADMIN_PASSWORD = process.env.AUTH_ADMIN_PASSWORD ?? process.env.AUTH_PASSWORD;

const USER_USERNAME = process.env.AUTH_USER_USERNAME;
const USER_PASSWORD = process.env.AUTH_USER_PASSWORD;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required.');
}

const credentialMap = new Map<string, CredentialDefinition>();

function registerCredential(username: string | undefined, password: string | undefined, role: UserRole): void {
  if (!username || !password) {
    return;
  }

  credentialMap.set(username, { username, password, role });
}

registerCredential(ADMIN_USERNAME, ADMIN_PASSWORD, 'admin');
registerCredential(USER_USERNAME, USER_PASSWORD, 'user');

if (credentialMap.size === 0) {
  registerCredential('admin', 'password', 'admin');
  registerCredential('user', 'password', 'user');
}

export const env = {
  port: Number(process.env.PORT) || 3000,
  jwtSecret: JWT_SECRET,
  credentials: Array.from(credentialMap.values())
};
