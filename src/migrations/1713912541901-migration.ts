import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1713912541901 implements MigrationInterface {
    name = 'Migration1713912541901'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallet" ADD "walletname" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "walletname"`);
    }

}
