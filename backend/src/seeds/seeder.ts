import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import { Event } from '../event/event.entity';
import { createEventFactory } from './factory/event.factory';

/**
 * Seeds the database with sample event data.
 * This script creates an application context without starting the HTTP server,
 * then uses TypeORM to populate the database with randomized event data.
 * It clears existing event records before seeding new ones.
 *
 * @returns A promise that resolves once the database is seeded and the application context is closed.
 */
async function bootstrap() {
  /*
     Creates an application context without starting the HTTP server.
     This is useful for running scripts that interact with the database.
    */
  const app = await NestFactory.createApplicationContext(AppModule);

  /*
     Retrieves the TypeORM DataSource instance from the application context.
    */
  const dataSource = app.get(DataSource);

  /*
     Gets the repository for the Event entity to perform database operations.
    */
  const eventRepository = dataSource.getRepository(Event);

  /*
     Optional: Clears all existing events from the database before seeding.
    */
  await eventRepository.clear();

  /*
     Generates an array of 10 event objects using the factory function.
    */
  const events: Event[] = [];

  for (let i = 0; i < 10; i++) {
    events.push(createEventFactory());
  }

  /*
     Saves the generated events into the database.
    */
  await eventRepository.save(events);
  console.log(`Seeded ${events.length} events.`);

  /*
     Closes the application context to free up resources.
    */
  await app.close();
}

/*
 Handles errors that may occur during the seeding process.
 If an error occurs, it logs the error message and exits the process with a failure code.
*/
bootstrap().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
