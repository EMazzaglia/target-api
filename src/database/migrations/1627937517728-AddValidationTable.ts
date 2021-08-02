import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddValidationTable1627937517728 implements MigrationInterface {
  name = 'AddValidationTable1627937517728';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      // eslint-disable-next-line max-len
      'CREATE TABLE "validate_user" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "validationHash" character varying NOT NULL, "userId" integer NOT NULL, CONSTRAINT "REL_f46d5e053877a4f8ff411c4dcf" UNIQUE ("id"), CONSTRAINT "PK_f46d5e053877a4f8ff411c4dcf9" PRIMARY KEY ("id"))'
    );
    await queryRunner.query(
      // eslint-disable-next-line max-len
      'ALTER TABLE "validate_user" ADD CONSTRAINT "FK_f46d5e053877a4f8ff411c4dcf9" FOREIGN KEY ("id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "validate_user" DROP CONSTRAINT "FK_f46d5e053877a4f8ff411c4dcf9"'
    );
    await queryRunner.query('DROP TABLE "validate_user"');
  }
}
