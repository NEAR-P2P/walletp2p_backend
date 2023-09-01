import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1693442288100 implements MigrationInterface {
    name = 'Migration1693442288100'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "otplist" DROP COLUMN "creation_date"`);
        await queryRunner.query(`ALTER TABLE "otplist" ADD "creation_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "otplist" DROP COLUMN "creation_date"`);
        await queryRunner.query(`ALTER TABLE "otplist" ADD "creation_date" integer`);
    }

}
