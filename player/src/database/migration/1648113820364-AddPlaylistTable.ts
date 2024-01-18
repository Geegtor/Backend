import {MigrationInterface, QueryRunner} from "typeorm";

class AddPlaylistTable1648113820364 implements MigrationInterface {
    name = 'AddPlaylistTable1648113820364'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "playlist" ("created_at" TIMESTAMP DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP DEFAULT ('now'::text)::timestamp(6) with time zone, "id" SERIAL NOT NULL, "cover" character varying NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_538c2893e2024fabc7ae65ad142" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "playlist_tracks_track" ("playlistId" integer NOT NULL, "trackId" integer NOT NULL, CONSTRAINT "PK_b1696ca1b814cd664fc3e50dbbc" PRIMARY KEY ("playlistId", "trackId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_53e780b9e2955ef02466636cda" ON "playlist_tracks_track" ("playlistId") `);
        await queryRunner.query(`CREATE INDEX "IDX_54dd1e92dd268df3dcc0cbb643" ON "playlist_tracks_track" ("trackId") `);
        await queryRunner.query(`ALTER TABLE "playlist" ADD CONSTRAINT "FK_92ca9b9b5394093adb6e5f55c4b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "playlist_tracks_track" ADD CONSTRAINT "FK_53e780b9e2955ef02466636cda7" FOREIGN KEY ("playlistId") REFERENCES "playlist"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "playlist_tracks_track" ADD CONSTRAINT "FK_54dd1e92dd268df3dcc0cbb643c" FOREIGN KEY ("trackId") REFERENCES "track"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "playlist_tracks_track" DROP CONSTRAINT "FK_54dd1e92dd268df3dcc0cbb643c"`);
        await queryRunner.query(`ALTER TABLE "playlist_tracks_track" DROP CONSTRAINT "FK_53e780b9e2955ef02466636cda7"`);
        await queryRunner.query(`ALTER TABLE "album" DROP CONSTRAINT "FK_3d06f25148a4a880b429e3bc839"`);
        await queryRunner.query(`ALTER TABLE "track" DROP CONSTRAINT "FK_92ddd84d4282ef453317fcd5529"`);
        await queryRunner.query(`ALTER TABLE "track" DROP CONSTRAINT "FK_f1a9870befc1a36288f1996d14a"`);
        await queryRunner.query(`ALTER TABLE "track" DROP CONSTRAINT "FK_b105d945c4c185395daca91606a"`);
        await queryRunner.query(`ALTER TABLE "track" DROP CONSTRAINT "FK_997cfd9e91fd00a363500f72dc2"`);
        await queryRunner.query(`ALTER TABLE "playlist" DROP CONSTRAINT "FK_92ca9b9b5394093adb6e5f55c4b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_54dd1e92dd268df3dcc0cbb643"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_53e780b9e2955ef02466636cda"`);
        await queryRunner.query(`DROP TABLE "playlist_tracks_track"`);
        await queryRunner.query(`DROP TABLE "auth_verification"`);
        await queryRunner.query(`DROP TABLE "album"`);
        await queryRunner.query(`DROP TABLE "artist"`);
        await queryRunner.query(`DROP TABLE "track"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "playlist"`);
        await queryRunner.query(`DROP TABLE "genre"`);
    }

}

export default AddPlaylistTable1648113820364;