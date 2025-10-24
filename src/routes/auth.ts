import { Request, Response, NextFunction, Router } from 'express';
import jwt from 'jsonwebtoken';
import { env, UserRole } from '../config/env';
import { HttpError } from '../errors/httpError';
import { User } from '../models/User';

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

async function authorizeUser(username: string, password: string): Promise<{ username: string; role: UserRole }> {
  const user = await User.findOne({ username, password });

  if (!user) {
    throw new HttpError(401, 'Invalid credentials.');
  }

  return { username: user.username, role: user.role };
}

authRouter.post('/login', async (req: Request<unknown, unknown, LoginRequestBody>, res: Response, next: NextFunction) => {
  try {
    const { username, password } = parseCredentials(req.body);
    const { username: canonicalUsername, role } = await authorizeUser(username, password);

    const access_token = jwt.sign({ sub: canonicalUsername, role }, env.jwtSecret, { expiresIn: '1h' });

    res.status(200).json({ access_token, tokenType: 'Bearer', expiresIn: 3600, role });
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
