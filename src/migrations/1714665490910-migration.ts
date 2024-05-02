import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1714665490910 implements MigrationInterface {
    name = 'Migration1714665490910'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallet" DROP CONSTRAINT "UQ_720faa85d7a37f0bc31af8b6698"`);
        await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "seedPhrase"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallet" ADD "seedPhrase" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "wallet" ADD CONSTRAINT "UQ_720faa85d7a37f0bc31af8b6698" UNIQUE ("seedPhrase")`);
    }

}
