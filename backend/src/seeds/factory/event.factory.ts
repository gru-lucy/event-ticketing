import { Event } from '../../event/event.entity';
import { faker } from '@faker-js/faker';

/**
 * Factory function to create a mock Event object for testing.
 * This function generates randomized event data using the Faker library,
 * while allowing overrides for specific properties.
 *
 * @param overrides - An optional object containing properties to override the generated values.
 * @returns A new Event object with randomized or overridden properties.
 */
export const createEventFactory = (overrides: Partial<Event> = {}): Event => {
  /*
     Generates a random total ticket count between 50 and 200.
    */
  const totalTickets = faker.number.int({ min: 50, max: 200 });

  /*
     Sets available tickets equal to total tickets by default.
    */
  const availableTickets = totalTickets;

  /*
     Creates a new Event instance and assigns random or overridden values.
    */
  const event = new Event();
  event.name = overrides.name || faker.company.catchPhrase();
  event.date = overrides.date || faker.date.future();
  event.totalTickets = overrides.totalTickets || totalTickets;
  event.availableTickets = overrides.availableTickets || availableTickets;

  /*
     Merges the generated event with any provided overrides and returns it.
    */
  return { ...event, ...overrides };
};
