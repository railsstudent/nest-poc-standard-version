import { MigrationInterface, QueryRunner } from 'typeorm'

export class generateEntities1623658364589 implements MigrationInterface {
  name = 'generateEntities1623658364589'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`)
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "lastname" text NOT NULL, "age" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "report" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "ownerId" uuid, CONSTRAINT "PK_99e4d0bea58cba73c57f935a546" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "report" ADD CONSTRAINT "FK_63ec95660163a6bf36b19f3471f" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "report" DROP CONSTRAINT "FK_63ec95660163a6bf36b19f3471f"`)
    await queryRunner.query(`DROP TABLE "report"`)
    await queryRunner.query(`DROP TABLE "user"`)
    await queryRunner.query(`DROP EXTENSION IF EXISTS "uuid-ossp"`)
  }
}
