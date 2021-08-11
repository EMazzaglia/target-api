import connection from '@database/connection';
import { redisClient } from '@server';
import { useSeeding } from 'typeorm-seeding';

beforeAll(async () => {
  await connection.create();
  await useSeeding();
});

afterAll(async () => {
  await redisClient.quit();
  await connection.close();
});

beforeEach(async () => {
  await connection.clear();
});
