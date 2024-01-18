import {MigrationInterface, QueryRunner} from 'typeorm';

class AddTracksToUser1644599892848 implements MigrationInterface {
  name = 'AddTracksToUser1644599892848';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "track" ADD "userId" integer`);
    await queryRunner.query(
      `ALTER TABLE "track" ADD CONSTRAINT "FK_92ddd84d4282ef453317fcd5529" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "track" DROP CONSTRAINT "FK_92ddd84d4282ef453317fcd5529"`);
    await queryRunner.query(`ALTER TABLE "track" DROP COLUMN "userId"`);
  }
}

export default AddTracksToUser1644599892848;
