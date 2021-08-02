import { ErrorsMessages } from '@constants/errorMessages';
import { Service } from 'typedi';
import { getRepository } from 'typeorm';
import { User } from '@entities/user.entity';
import { UsersService } from '@services/users.service';
import { RedisService } from '@services/redis.service';
import { AuthInterface } from '@interfaces';
import { DatabaseError } from '@exception/database.error';
import { RedisError } from '@exception/redis.error';
import { UnAuthorizedError } from '@exception/unauthorized.error';
import { ValidateUser } from '@entities/validateUser.entity';
// import { EmailService } from './email.service';
// import { IEmail } from 'src/interfaces/email/email.interface';
@Service()
export class SessionService {
  constructor(
    private readonly userService: UsersService,
    private readonly redisService: RedisService
  ) {}

  private readonly userRepository = getRepository<User>(User);
  private readonly validateUserRepository =
    getRepository<ValidateUser>(ValidateUser);

  async signUp(user: User) {
    try {
      this.userService.hashUserPassword(user);
      const inactiveUser = await this.userRepository.save(user);
      const validationHash = 'holaCharola';
      this.validateUserRepository.save({
        id: inactiveUser.id,
        validationHash: validationHash
      });
      // const url =
      //   'http://localhost:3000/api/v1/auth/' +
      //   `${inactiveUser.id}/${validationHash}`;
      // const email: IEmail = {
      //   from: 'emilianomazzaglia@gmail.com',
      //   to: inactiveUser.email,
      //   subject: 'Confirmation Email',
      //   text: 'Please click on the following URL: ' + url
      // };

      // TODO: Check the implementation, we could take some sender as default
      // await EmailService.sendEmail(email, 'SES');
      return inactiveUser;
    } catch (error) {
      throw new DatabaseError(error.message + ' ' + error.detail);
    }
  }

  async validateUser(validationUser: AuthInterface.IValidateUser) {
    try {
      // Retrieve the user from the table if the hash is valid.
      await this.validateUserRepository.findOneOrFail({
        where: {
          userId: validationUser.id,
          validationHash: validationUser.hash
        }
      });

      // If the user exists and the hash is valid, update the status to active.
      await this.userRepository.update(
        { id: validationUser.id },
        { status: true }
      );
      return 'Account activated successfully!';
    } catch (error: any) {
      throw new Error('Pasaron cosas en la validacion.');
    }
  }

  async signIn(input: AuthInterface.ISignInInput) {
    const { email, password } = input;

    let user: User;
    try {
      user = await User.createQueryBuilder('user')
        .addSelect('user.password')
        .where({ email })
        .getOneOrFail();
    } catch (error) {
      throw new UnAuthorizedError(
        ErrorsMessages.INVALID_CREDENTIALS_NAME,
        ErrorsMessages.INVALID_CREDENTIALS_DESC
      );
    }

    if (
      !this.userService.comparePassword({
        password,
        userPassword: user.password
      })
    ) {
      throw new UnAuthorizedError(
        ErrorsMessages.INVALID_CREDENTIALS_NAME,
        ErrorsMessages.INVALID_CREDENTIALS_DESC
      );
    }

    const token = this.userService.generateToken(user);
    this.userService.hashUserPassword(user);
    return token;
  }

  logOut(input: AuthInterface.ITokenToBlacklistInput): Promise<number> {
    const tokenAddedToBlacklist = this.redisService.addTokenToBlacklist(input);
    if (!tokenAddedToBlacklist) {
      throw new RedisError(ErrorsMessages.REDIS_ERROR_SET_TOKEN);
    }
    return tokenAddedToBlacklist;
  }
}
