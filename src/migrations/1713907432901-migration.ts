import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1713907432901 implements MigrationInterface {
    name = 'Migration1713907432901'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallet" ADD "name" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "name"`);
    }

}
