import {MigrationInterface, QueryRunner} from 'typeorm';

class AddAuthVerificationTable1643726652912 implements MigrationInterface {
  name = 'AddAuthVerificationTable1643726652912';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "auth_verification" ("created_at" TIMESTAMP DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP DEFAULT ('now'::text)::timestamp(6) with time zone, "id" SERIAL NOT NULL, "verificationCode" character varying, CONSTRAINT "PK_28e87f85d1fb431d5786285fd6e" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "auth_verification"`);
  }
}

export default AddAuthVerificationTable1643726652912;
