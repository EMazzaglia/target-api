import { Errors } from '@constants/errorMessages';
import { Service } from 'typedi';
import { User } from '@entities/user.entity';
import { UsersService } from '@services/users.service';
import { getRepository } from 'typeorm';
import { AuthInterface } from '@interfaces';
import { SignUpUser } from '@domain/signUpUser';

@Service()
export class SessionService {
  constructor(private readonly userService: UsersService) {}

  private readonly userRepository = getRepository<User>(User);

  createUserEntity(notValidatedUser: SignUpUser) {
    if (notValidatedUser.password === notValidatedUser.confirmedPassword) {
      const firstName = notValidatedUser.firstName;
      const lastName = notValidatedUser.lastName;
      const email = notValidatedUser.email;
      const gender = notValidatedUser.gender;
      const password = notValidatedUser.password;
      const user = new User();
      user.firstName = firstName;
      user.lastName = lastName;
      user.email = email;
      user.gender = gender;
      user.password = password;
      return user;
    }
    throw new Error(Errors.PASSWORDS_NOT_MATCH);
  }

  async signUp(user: User) {
    let newUser: User;
    try {
      this.userService.hashUserPassword(user);
      newUser = await this.userRepository.save(user);
    } catch (error) {
      throw new Error(error.detail ?? Errors.MISSING_PARAMS);
    }

    return newUser;
  }

  async signIn(input: AuthInterface.ISignInInput) {
    const { email, password } = input;
    if (!this.userService.givenCredentials({ email, password })) {
      throw new Error(Errors.MISSING_PARAMS);
    }

    let user: User;
    try {
      user = await User.createQueryBuilder('user')
        .addSelect('user.password')
        .where({ email })
        .getOneOrFail();
    } catch (error) {
      throw new Error(Errors.INVALID_CREDENTIALS);
    }

    if (
      !this.userService.comparePassword({
        password,
        userPassword: user.password
      })
    ) {
      throw new Error(Errors.INVALID_CREDENTIALS);
    }

    const token = this.userService.generateToken(user);
    this.userService.hashUserPassword(user);
    return token;
  }
}
