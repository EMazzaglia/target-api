import { ErrorsMessages } from '@constants/errorMessages';
import { Service } from 'typedi';
import { getRepository } from 'typeorm';
import { User, UserStatus } from '@entities/user.entity';
import { UsersService } from '@services/users.service';
import { RedisService } from '@services/redis.service';
import { AuthInterface } from '@interfaces';
import { DatabaseError } from '@exception/database.error';
import { RedisError } from '@exception/redis.error';
import { UnAuthorizedError } from '@exception/unauthorized.error';
import Jwt from 'jsonwebtoken';
import { InternalServerError } from 'routing-controllers';
import { EmailService } from './email/email.service';
import { SignUpConfirmationEmail } from './email/SignUpConfirmationEmail';
@Service()
export class SessionService {
  constructor(
    private readonly userService: UsersService,
    private readonly redisService: RedisService,
    private readonly emailService: EmailService
  ) {}
  userRepository = getRepository<User>(User);

  async signUp(user: User) {
    try {
      const inactiveUser = await this.userRepository.save(
        this.createUserEntity(user)
      );
      // TODO: Check the implementation, we could take some sender as default
      this.emailService.sendEmail(new SignUpConfirmationEmail(inactiveUser));
      return inactiveUser;
    } catch (error) {
      throw new DatabaseError(error.message + ' ' + error.detail);
    }
  }

  async validateUser(validationUser: AuthInterface.IValidateUser) {
    try {
      await this.userRepository.findOneOrFail({
        where: {
          id: validationUser.id,
          activationCode: validationUser.token
        }
      });

      // If the user exists and the token is valid, update the status to active.
      await this.userRepository.update(
        { id: validationUser.id },
        { status: UserStatus.ACTIVE }
      );
      return { message: 'Account activated successfully!' };
    } catch (error: any) {
      throw new InternalServerError(
        'An error ocurred during the validation of the account'
      );
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

  createUserEntity(user: User) {
    this.userService.hashUserPassword(user);
    const token = Jwt.sign({ email: user.email }, 'node-base-secret');
    user.activationCode = token;
    return user;
  }
}
