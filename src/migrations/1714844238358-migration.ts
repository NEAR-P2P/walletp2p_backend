import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1714844238358 implements MigrationInterface {
    name = 'Migration1714844238358'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "walletbot" DROP CONSTRAINT "UQ_94cc2d752353b00507feb53f6e7"`);
        await queryRunner.query(`ALTER TABLE "walletbot" DROP COLUMN "email"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "walletbot" ADD "email" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "walletbot" ADD CONSTRAINT "UQ_94cc2d752353b00507feb53f6e7" UNIQUE ("email")`);
    }

}
