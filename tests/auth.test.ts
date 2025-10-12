import request from 'supertest';
import app from '../src/app';

const VALID_USERNAME = process.env.AUTH_USERNAME ?? 'tester';
const VALID_PASSWORD = process.env.AUTH_PASSWORD ?? 'secret-password';

describe('Auth routes', () => {
  describe('POST /auth/login', () => {
    it('returns a JWT when credentials are valid', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ username: VALID_USERNAME, password: VALID_PASSWORD })
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          token: expect.any(String),
          tokenType: 'Bearer',
          expiresIn: 3600
        })
      );
      expect(response.body.token).not.toHaveLength(0);
    });

    it('rejects invalid credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ username: 'wrong', password: 'credentials' })
        .expect(401);

      expect(response.body).toEqual(
        expect.objectContaining({
          error: 'Invalid credentials.'
        })
      );
    });

    it('validates request payload presence', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ username: VALID_USERNAME })
        .expect(400);

      expect(response.body).toEqual(
        expect.objectContaining({
          error: 'Both username and password must be provided as strings.'
        })
      );
    });
  });

  describe('POST /auth/verify', () => {
    it('confirms a valid token', async () => {
      const loginResponse = await request(app)
        .post('/auth/login')
        .send({ username: VALID_USERNAME, password: VALID_PASSWORD })
        .expect(200);

      const verifyResponse = await request(app)
        .post('/auth/verify')
        .send({ token: loginResponse.body.token })
        .expect(200);

      expect(verifyResponse.body).toEqual(
        expect.objectContaining({
          valid: true,
          payload: expect.any(Object)
        })
      );
    });

    it('rejects malformed tokens', async () => {
      const response = await request(app)
        .post('/auth/verify')
        .send({ token: 'not-a-valid-token' })
        .expect(401);

      expect(response.body).toEqual(
        expect.objectContaining({
          error: 'Invalid or expired token.'
        })
      );
    });

    it('requires token in request body', async () => {
      const response = await request(app)
        .post('/auth/verify')
        .send({})
        .expect(400);

      expect(response.body).toEqual(
        expect.objectContaining({
          error: 'Token is required in request body.'
        })
      );
    });
  });
});
