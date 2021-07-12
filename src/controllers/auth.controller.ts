import {
  JsonController,
  Body,
  Post,
  BodyParam,
  UnauthorizedError,
  BadRequestError,
  Res
} from 'routing-controllers';
import omit from 'lodash/omit';
import { Service } from 'typedi';
import { User } from '@entities/user.entity';
import { SessionService } from '@services/session.service';
import { Errors } from '@constants/errorMessages';
import { UserDTO } from 'src/dto/userDTO';
import { classToPlain, plainToClass } from 'class-transformer';
@JsonController('/auth')
@Service()
export class AuthController {
  constructor(private readonly sessionService: SessionService) {}

  @Post('/signup')
  async signUp(@Body({ validate: true }) user: UserDTO, @Res() response: any) {
    const userJSON = classToPlain(user);
    const entityUser: User = plainToClass(User, userJSON);
    const newUser = await this.sessionService.signUp(entityUser);
    return response.send(omit(newUser, ['password']));
  }

  @Post('/signin')
  async signIn(
    @BodyParam('email') email: string,
    @BodyParam('password') password: string
  ) {
    try {
      const token = await this.sessionService.signIn({ email, password });
      return { token };
    } catch (error) {
      switch (error?.message) {
        case Errors.MISSING_PARAMS:
          throw new BadRequestError(Errors.MISSING_PARAMS);
        default:
          throw new UnauthorizedError(Errors.INVALID_CREDENTIALS);
      }
    }
  }
}
