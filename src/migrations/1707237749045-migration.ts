import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1707237749045 implements MigrationInterface {
    name = 'Migration1707237749045'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallet" ADD "cedula" character varying`);
        await queryRunner.query(`ALTER TABLE "wallet" ADD "nft" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "nft"`);
        await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "cedula"`);
    }

}
