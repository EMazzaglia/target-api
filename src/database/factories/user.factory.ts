import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { User } from '@entities/user.entity';
import { genSaltSync, hashSync } from 'bcrypt';

const genders = ['female', 'male'];

define(User, (faker: typeof Faker) => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const email = faker.internet.email(firstName, lastName);
  const gender = faker.random.arrayElement(genders);
  const password = 'password';

  const user = new User();
  user.firstName = firstName;
  user.lastName = lastName;
  user.email = email;
  user.gender = gender;

  user.password = hashSync(password, genSaltSync());

  return user;
});
