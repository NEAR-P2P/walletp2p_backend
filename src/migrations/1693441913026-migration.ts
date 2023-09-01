import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1693441913026 implements MigrationInterface {
    name = 'Migration1693441913026'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "wallet" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "seedPhrase" character varying NOT NULL, "name" character varying NOT NULL, "creation_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_a780eacf7b5757c8003d122ff26" UNIQUE ("email"), CONSTRAINT "UQ_720faa85d7a37f0bc31af8b6698" UNIQUE ("seedPhrase"), CONSTRAINT "PK_bec464dd8d54c39c54fd32e2334" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d5bdfd3a0880397419bb3fc21b" ON "wallet" ("id", "email") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_d5bdfd3a0880397419bb3fc21b"`);
        await queryRunner.query(`DROP TABLE "wallet"`);
    }

}
