import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1694096326019 implements MigrationInterface {
    name = 'Migration1694096326019'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallet" RENAME COLUMN "name" TO "nickname"`);
        await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "nickname"`);
        await queryRunner.query(`ALTER TABLE "wallet" ADD "nickname" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "nickname"`);
        await queryRunner.query(`ALTER TABLE "wallet" ADD "nickname" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "wallet" RENAME COLUMN "nickname" TO "name"`);
    }

}
