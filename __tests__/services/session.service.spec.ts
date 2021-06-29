import { Container } from 'typedi';
import { SessionService } from '@services/session.service';
import { SignUpUser } from '../../src/domain/SignUpUser';
import { Errors } from '@constants/errorMessages';
import { clear } from 'console';

let sessionService: SessionService;
let signUpUser: SignUpUser;

beforeAll(async () => {
  sessionService = Container.get(SessionService);
  signUpUser = new SignUpUser();
  signUpUser.email = 'email@gmail.com';
  signUpUser.gender = 'male';
});

describe('When valid user attemp to sign up', () => {
  beforeEach(() => {
    signUpUser.password = 'password1';
    signUpUser.confirmedPassword = 'password1';
  });

  it('expect to return a new user entity', () => {
    const result = sessionService.createUserEntity(signUpUser);
    expect(result).toStrictEqual(
      expect.objectContaining({
        password: 'password1',
        email: 'email@gmail.com',
        gender: 'male'
      })
    );
  });
});

describe('When invalid user attemp to sign up', () => {
  beforeEach(() => {
    signUpUser.password = 'password1';
    signUpUser.confirmedPassword = 'password2';
  });

  it('expect to throw an error', () => {
    expect(() => {
      sessionService.createUserEntity(signUpUser);
    }).toThrow("The password and validationPassword doesn't match");
  });
});
