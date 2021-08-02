import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { User, UserGender } from '@entities/user.entity';

define(User, (faker: typeof Faker) => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const email = faker.internet.email(firstName, lastName);
  const password = faker.internet.password(8);
  const gender = UserGender.FEMALE;
  const status = true;

  const user = new User();
  user.firstName = firstName;
  user.lastName = lastName;
  user.email = email;
  user.password = password;
  user.gender = gender;
  user.status = status;

  return user;
});
