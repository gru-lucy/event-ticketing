import { Resolver, Query, Int, GraphQLISODateTime } from '@nestjs/graphql';
import { EventService } from './event.service';
import { ObjectType, Field } from '@nestjs/graphql';

/**
 * GraphQL object type representing an event.
 * This class defines the shape of the event data that can be fetched via the GraphQL API.
 * Each field is exposed as a GraphQL field with specific types like Int or GraphQLISODateTime.
 */
@ObjectType()
export class EventType {
  /*
     Unique identifier for the event, exposed as an integer in GraphQL.
    */
  @Field(() => Int)
  id: number;

  /*
     Name of the event, exposed as a string in GraphQL.
    */
  @Field()
  name: string;

  /*
     Scheduled date of the event, exposed in ISO date-time format in GraphQL.
    */
  @Field(() => GraphQLISODateTime)
  date: Date;

  /*
     Total number of tickets issued for the event, exposed as an integer in GraphQL.
    */
  @Field(() => Int)
  totalTickets: number;

  /*
     Number of tickets currently available for purchase, exposed as an integer in GraphQL.
    */
  @Field(() => Int)
  availableTickets: number;
}

/**
 * Resolver class for events.
 * This class contains GraphQL queries to interact with event data using the EventService.
 */
@Resolver(() => EventType)
export class EventResolver {
  constructor(private eventService: EventService) {} // Dependency injection of the EventService.

  /*
     GraphQL query to retrieve a list of all events.
     Returns an array of EventType instances, fetched using the EventService.
    */
  @Query(() => [EventType])
  async events(): Promise<EventType[]> {
    return this.eventService.findAll(); // Fetch all event records from the database using the service.
  }
}
