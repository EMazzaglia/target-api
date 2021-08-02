import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Base } from './base.entity';
import { User } from './user.entity';

@Entity()
export class ValidateUser extends Base {
  @Column()
  validationHash!: string;

  @Column()
  @OneToOne(() => User)
  @JoinColumn({ name: 'id' })
  userId!: number;
}
