import request from 'supertest';
import { getRepository } from 'typeorm';
import { factory } from 'typeorm-seeding';
import app from '@app';
import { User } from '@entities/user.entity';
import { API } from '../../utils';
import { HttpStatusCode } from '@constants/httpStatusCode';
import { ErrorsMessages } from '@constants/errorMessages';
import { EmailService } from '@services/email/email.service';
import { SessionService } from '@services/session.service';
import { UsersService } from '@services/users.service';
import { JWTService } from '@services/jwt.service';
import { RedisService } from '@services/redis.service';
import { SignUpConfirmationEmail } from '@services/email/SignUpConfirmationEmail';

describe('creating a user', () => {
  it('returns http code 200 and creates the user', async () => {
    const userFields = await factory(User)().make();
    const response = await request(app).post(`${API}/users`).send(userFields);
    expect(response.status).toBe(200);

    const userRepo = getRepository<User>(User);
    expect(await userRepo.count()).toBeGreaterThan(0);
  });

  it('returns http code 400 if email is incorrect', async () => {
    const userFields = await factory(User)().make();
    userFields.email = '';

    const response = await request(app).post(`${API}/users`).send(userFields);
    expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);

    expect(response.body).toStrictEqual({
      description: ErrorsMessages.BODY_ERRORS,
      httpCode: HttpStatusCode.BAD_REQUEST,
      errors: [ErrorsMessages.EMAIL_ERROR],
      name: ErrorsMessages.BAD_REQUEST_ERROR
    });
  });

  it('returns http code 400 if password is incorrect', async () => {
    const userFields = await factory(User)().make();
    userFields.password = '';

    const response = await request(app).post(`${API}/users`).send(userFields);
    expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);

    expect(response.body).toStrictEqual({
      description: ErrorsMessages.BODY_ERRORS,
      httpCode: HttpStatusCode.BAD_REQUEST,
      errors: [ErrorsMessages.PASSWORD_ERROR],
      name: ErrorsMessages.BAD_REQUEST_ERROR
    });
  });

  it('when repeated email is used to create a user, returns http code 500', async () => {
    const userFields = await factory(User)().make();

    const userRepo = getRepository<User>(User);

    const validResponse = await request(app)
      .post(`${API}/users`)
      .send(userFields);
    expect(validResponse.status).toBe(200);

    const failingResponse = await request(app)
      .post(`${API}/users`)
      .send(userFields);
    expect(failingResponse.status).toBe(400);
    expect(failingResponse.body).toStrictEqual({
      description: expect.stringContaining(userFields.email),
      httpCode: HttpStatusCode.BAD_REQUEST,
      name: 'BadRequestError'
    });

    expect(await userRepo.count()).toBe(1);
  });

  it('produces a call to the emailService', async () => {
    const userFields = await factory(User)().make();
    const jwtService = new JWTService();
    const userService = new UsersService(jwtService);
    const redisService = new RedisService();
    const emailService = new EmailService();
    let confirmation = new SignUpConfirmationEmail(userFields);

    jest.spyOn(emailService, 'sendEmail').mockImplementation(confirmation => {
      return userFields;
    });

    const sessionService = new SessionService(
      userService,
      redisService,
      emailService
    );
    sessionService.userRepository.save = jest.fn().mockImplementation(() => {
      return {
        userFields,
        id: 20,
        activationCode: 'activationCode'
      };
    });
    sessionService.signUp(userFields);
    expect(emailService.sendEmail).toHaveBeenCalled();
  });
});
