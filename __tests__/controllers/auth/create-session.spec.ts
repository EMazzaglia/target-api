import request from 'supertest';
import app from '@app';
import { factory } from 'typeorm-seeding';
import { User } from '@entities/user.entity';
import { API } from '../../utils';
import { genSaltSync, hashSync } from 'bcrypt';
import { ErrorsMessages } from '@constants/errorMessages';
import { HttpStatusCode } from '@constants/httpStatusCode';

describe('creating a session', () => {
  let email;
  let password;
  let hashedPassword;

  beforeEach(async () => {
    hashedPassword = hashSync('password123', genSaltSync());
    const user = await factory(User)().create({ password: hashedPassword });
    email = user.email;
    password = 'password123';
  });

  it('returns http code 200 with valid params', async () => {
    const authFields = {
      email,
      password
    };
    const response = await request(app)
      .post(`${API}/auth/signin`)
      .send(authFields);
    expect(response.status).toBe(200);
  });

  it('returns http code 401 with invalid params', async () => {
    const authFields = {
      email: 'r4nD0m@3M4Il.com',
      password: 'r4Nd0mPa55w0rD'
    };
    const response = await request(app)
      .post(`${API}/auth/signin`)
      .send(authFields);
    expect(response.status).toBe(401);
    expect(response.body).toStrictEqual({
      name: ErrorsMessages.INVALID_CREDENTIALS_NAME,
      httpCode: HttpStatusCode.UNAUTHORIZED,
      description: ErrorsMessages.INVALID_CREDENTIALS_DESC
    });
  });
});
