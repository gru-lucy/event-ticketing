import { MigrationInterface, QueryRunner } from 'typeorm';

export class Orders1741662323910 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "order" (
        "id" SERIAL NOT NULL,
        "orderNumber" character varying NOT NULL,
        "quantity" integer NOT NULL,
        "eventId" integer,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "PK_order_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "order"
      ADD CONSTRAINT "FK_order_event" FOREIGN KEY ("eventId")
      REFERENCES "event"("id")
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_order_event"`,
    );
    await queryRunner.query(`DROP TABLE "order"`);
  }
}
