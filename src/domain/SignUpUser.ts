import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignUpUser {
  @IsString()
  firstName?: string;

  @IsString()
  lastName?: string;

  @IsEmail()
  email!: string;

  @IsNotEmpty()
  password!: string;

  @IsNotEmpty()
  validationPassword!: string;

  @IsString()
  @IsNotEmpty()
  gender!: string;
}
