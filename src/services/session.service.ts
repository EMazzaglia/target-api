import { Errors } from '@constants/errorMessages';
import { Service } from 'typedi';
import { User } from '@entities/user.entity';
import { UsersService } from '@services/users.service';
import { getRepository } from 'typeorm';
import { AuthInterface } from '@interfaces';
import { DatabaseError } from 'src/dto/error/databaseError';

@Service()
export class SessionService {
  constructor(private readonly userService: UsersService) {}

  private readonly userRepository = getRepository<User>(User);

  async signUp(user: User) {
    try {
      this.userService.hashUserPassword(user);
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      throw new DatabaseError(error.message + ' ' + error.detail);
    }
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
