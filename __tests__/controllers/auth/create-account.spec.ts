import request from 'supertest';
import app from '@app';
import { factory } from 'typeorm-seeding';
import { User } from '@entities/user.entity';
import { API } from '../../utils';
import { ErrorsMessages } from '@constants/errorMessages';
import { HttpStatusCode } from '@constants/httpStatusCode';

describe('creating an account', () => {
  it('returns http code 200 with valid params', async done => {
    const userFields = await factory(User)().make();
    const response = await request(app)
      .post(`${API}/auth/signup`)
      .send(userFields);
    expect(response.status).toBe(200);
    done();
  });

  it('returns http code 400 with invalid params', async () => {
    const userFields = {};
    const response = await request(app)
      .post(`${API}/auth/signup`)
      .send(userFields);
    expect(response.status).toBe(400);
  });

  it('returns http code 400 with 4 errors inside the errors field', async done => {
    const incompletRequest = {
      password: 'lelelele1'
    };
    const response = await request(app)
      .post(`${API}/auth/signup`)
      .send(incompletRequest);
    expect(response.body).toEqual({
      description: ErrorsMessages.BODY_ERRORS,
      errors: [
        ErrorsMessages.FIRSTNAME_ERROR,
        ErrorsMessages.LASTNAME_ERROR,
        ErrorsMessages.GENDER_ERROR,
        ErrorsMessages.EMAIL_ERROR
      ],
      httpCode: HttpStatusCode.BAD_REQUEST,
      name: ErrorsMessages.BAD_REQUEST_ERROR
    });
    expect(response.body.errors).toHaveLength(4);
    done();
  });
});
