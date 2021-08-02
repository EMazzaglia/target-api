import { Column, Entity, Index } from 'typeorm';
import { Base } from './base.entity';
@Entity()
export class User extends Base {
  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column()
  @Index({ unique: true })
  email!: string;

  @Column({ select: false })
  password!: string;

  @Column()
  gender!: string;

  @Column({ default: false })
  status!: boolean;
}

export enum UserGender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other'
}
