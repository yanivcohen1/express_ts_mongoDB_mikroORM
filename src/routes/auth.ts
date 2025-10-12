import { Request, Response, NextFunction, Router } from 'express';
import jwt from 'jsonwebtoken';
import { env, CredentialDefinition, UserRole } from '../config/env';
import { HttpError } from '../errors/httpError';

interface LoginRequestBody {
  username?: unknown;
  password?: unknown;
}

interface VerifyRequestBody {
  token?: unknown;
}

const authRouter = Router();

function parseCredentials(body: LoginRequestBody): { username: string; password: string } {
  const { username, password } = body;

  if (typeof username !== 'string' || typeof password !== 'string') {
    throw new HttpError(400, 'Both username and password must be provided as strings.');
  }

  return { username, password };
}

function authorizeUser(username: string, password: string): { username: string; role: UserRole } {
  const match = env.credentials.find((credential: CredentialDefinition) => credential.username === username);

  if (!match || match.password !== password) {
    throw new HttpError(401, 'Invalid credentials.');
  }

  return { username: match.username, role: match.role };
}

authRouter.post('/login', (req: Request<unknown, unknown, LoginRequestBody>, res: Response, next: NextFunction) => {
  try {
    const { username, password } = parseCredentials(req.body);
    const { username: canonicalUsername, role } = authorizeUser(username, password);

    const token = jwt.sign({ sub: canonicalUsername, role }, env.jwtSecret, { expiresIn: '1h' });

    res.status(200).json({ token, tokenType: 'Bearer', expiresIn: 3600, role });
  } catch (error) {
    next(error);
  }
});

authRouter.post('/verify', (req: Request<unknown, unknown, VerifyRequestBody>, res: Response, next: NextFunction) => {
  try {
    const { token } = req.body;

    if (typeof token !== 'string') {
      throw new HttpError(400, 'Token is required in request body.');
    }

    const decoded = jwt.verify(token, env.jwtSecret);
    res.status(200).json({ valid: true, payload: decoded });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new HttpError(401, 'Invalid or expired token.'));
      return;
    }
    next(error);
  }
});

export default authRouter;
