import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1693441767928 implements MigrationInterface {
    name = 'Migration1693441767928'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "otplist" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "code" character varying NOT NULL, "creation_date" integer, CONSTRAINT "UQ_d4dd404a4a2c44a74f9302e65fd" UNIQUE ("email"), CONSTRAINT "PK_a26ded78e1e62afb33ec4ce5205" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d534b0cb38433a850b7d860cf0" ON "otplist" ("id", "email") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_d534b0cb38433a850b7d860cf0"`);
        await queryRunner.query(`DROP TABLE "otplist"`);
    }

}
