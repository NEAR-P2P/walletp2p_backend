import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1714843200824 implements MigrationInterface {
    name = 'Migration1714843200824'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "walletbot" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "idtelegram" character varying, "walletname" character varying, "creation_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_94cc2d752353b00507feb53f6e7" UNIQUE ("email"), CONSTRAINT "UQ_9822dcbbb3082aa9a90c2a1fda4" UNIQUE ("walletname"), CONSTRAINT "PK_861d8f645dc127a6de3793992db" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_861d8f645dc127a6de3793992d" ON "walletbot" ("id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_861d8f645dc127a6de3793992d"`);
        await queryRunner.query(`DROP TABLE "walletbot"`);
    }

}
