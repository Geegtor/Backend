import {MigrationInterface, QueryRunner} from "typeorm";

class TrackFix1648212662288 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "track" RENAME COLUMN "file" TO "audio"`);
        await queryRunner.query(`ALTER TABLE "track" DROP "description"`);
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "track" DROP COLUMN "audio"`);
    }

}

export default TrackFix1648212662288;