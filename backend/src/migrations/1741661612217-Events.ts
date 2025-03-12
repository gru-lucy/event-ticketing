import { MigrationInterface, QueryRunner } from 'typeorm';

export class Events1741661612217 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "event" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "date" TIMESTAMP NOT NULL,
                "totalTickets" integer NOT NULL,
                "availableTickets" integer NOT NULL,
                CONSTRAINT "PK_event_id" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "event"`);
  }
}
