import { UserGender } from '@entities/user.entity';
import { IsEnum, IsString } from 'class-validator';
import { BaseUserDTO } from './baseUserDTO';

export class SignUpDTO extends BaseUserDTO {
  @IsString()
  firstName?: string;

  @IsString()
  lastName?: string;

  @IsEnum(UserGender)
  gender!: string;
}
