import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1718835576546 implements MigrationInterface {
    name = 'Migration1718835576546'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "preRegistration" ADD CONSTRAINT "UQ_03aca7395cbb44b37bfaa7ae7b5" UNIQUE ("ip")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "preRegistration" DROP CONSTRAINT "UQ_03aca7395cbb44b37bfaa7ae7b5"`);
    }

}
