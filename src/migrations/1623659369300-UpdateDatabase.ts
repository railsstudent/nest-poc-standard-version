import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateDatabase1623659369300 implements MigrationInterface {
  name = 'UpdateDatabase1623659369300'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`)
    await queryRunner.query(`ALTER TABLE "user" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`)
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updatedAt"`)
    await queryRunner.query(`ALTER TABLE "user" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`)
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "version" SET DEFAULT '1'`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "version" DROP DEFAULT`)
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updatedAt"`)
    await queryRunner.query(`ALTER TABLE "user" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`)
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`)
    await queryRunner.query(`ALTER TABLE "user" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`)
  }
}
