import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserStatusColumn1627926037157 implements MigrationInterface {
  name = 'AddUserStatusColumn1627926037157';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "user" ADD "status" boolean NOT NULL DEFAULT false'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "user" DROP COLUMN "status"');
  }
}
