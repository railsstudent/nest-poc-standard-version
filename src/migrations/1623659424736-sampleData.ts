import { MigrationInterface, QueryRunner } from 'typeorm'

export class sampleData1623659424736 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO "user" ("id", "name", "lastname", "age", "version") values (
      '87ed3bb1-d108-45c0-abd8-ed53c9a3d88c', 'John', 'Doe', 22, 1)`)

    await queryRunner.query(`INSERT INTO "user" ("id", "name", "lastname", "age", "version") values (
      'd5bd699d-1aa3-49d5-83d2-42c5bf4fbf7f', 'Jane', 'Doe', 25, 1)`)

    await queryRunner.query(`INSERT INTO "report" ("id", "name", "ownerId", "version") values (
            '6aca64d5-28cd-43c4-bec7-6d3eb7a8e13a',
            'Report 1',
            '87ed3bb1-d108-45c0-abd8-ed53c9a3d88c',
            1
        )`)

    await queryRunner.query(`INSERT INTO "report" ("id", "name", "ownerId", "version") values (
            'e65ccb60-e3db-48de-8581-bf81c5a18b94',
            'Report 2',
            '87ed3bb1-d108-45c0-abd8-ed53c9a3d88c',
            1
        )`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "report" where "id" = 'e65ccb60-e3db-48de-8581-bf81c5a18b94'`)
    await queryRunner.query(`DELETE FROM "report" where "id" = '6aca64d5-28cd-43c4-bec7-6d3eb7a8e13a'`)
    await queryRunner.query(`DELETE FROM "user" where "id" = '87ed3bb1-d108-45c0-abd8-ed53c9a3d88c'`)
  }
}
