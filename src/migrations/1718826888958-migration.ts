import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1718826888958 implements MigrationInterface {
    name = 'Migration1718826888958'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "preRegistration" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "cedula" character varying NOT NULL, "ip" character varying NOT NULL, "validOtp" boolean NOT NULL DEFAULT false, "proccess" boolean NOT NULL DEFAULT false, "registered" boolean NOT NULL DEFAULT false, "creation_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_65bb63cd8e9019b11f507be7342" UNIQUE ("email"), CONSTRAINT "PK_ec7778f9e9df6cfadc09bb94e80" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e1f9bbf23999578bceee6aa35c" ON "preRegistration" ("id", "email") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_e1f9bbf23999578bceee6aa35c"`);
        await queryRunner.query(`DROP TABLE "preRegistration"`);
    }

}
