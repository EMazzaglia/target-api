import { BeforeInsert, Column, Entity, Index } from 'typeorm';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  validateOrReject
} from 'class-validator';

import { Base } from './base.entity';

@Entity()
export class User extends Base {
  @BeforeInsert()
  async beforeInsert() {
    await validateOrReject(this);
  }

  @Column({ nullable: true })
  @IsString()
  firstName?: string;

  @Column({ nullable: true })
  @IsString()
  lastName?: string;

  @Column()
  @IsEmail()
  @Index({ unique: true })
  email!: string;

  @Column({ select: false })
  @IsNotEmpty()
  @MinLength(6)
  password!: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  gender!:string;
}
