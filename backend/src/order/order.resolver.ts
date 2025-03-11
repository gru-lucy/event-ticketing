import {
  Resolver,
  Mutation,
  Args,
  Int,
  GraphQLISODateTime,
} from '@nestjs/graphql';
import { Order } from './order.entity';
import { OrderService } from './order.service';
import { ObjectType, Field } from '@nestjs/graphql';
import { EventType } from '../event/event.resolver';

/**
 * GraphQL object type representing an order.
 * This class defines the structure of order data exposed via the GraphQL API.
 * Each field corresponds to an order property, including ID, order number,
 * ticket quantity, the associated event, and creation timestamp.
 */
@ObjectType()
export class OrderType {
  /*
     Unique identifier for the order, exposed as an integer in GraphQL.
    */
  @Field(() => Int)
  id: number;

  /*
     Unique order number assigned to the purchase.
    */
  @Field()
  orderNumber: string;

  /*
     Number of tickets purchased in this order.
    */
  @Field(() => Int)
  quantity: number;

  /*
     The event associated with this order.
    */
  @Field(() => EventType)
  event: Event;

  /*
     Timestamp when the order was created.
    */
  @Field(() => GraphQLISODateTime)
  createdAt: Date;
}

/**
 * Resolver class for orders.
 * This class contains GraphQL mutations to handle order-related operations.
 */
@Resolver(() => OrderType)
export class OrderResolver {
  /*
     Constructor to inject the OrderService.
     @param orderService - The service handling order-related logic.
    */
  constructor(private orderService: OrderService) {}

  /*
     GraphQL mutation to purchase tickets for an event.
     @param eventId - The unique identifier of the event.
     @param quantity - The number of tickets to purchase.
     @returns A promise resolving to the created Order object.
    */
  @Mutation(() => OrderType)
  async purchaseTickets(
    @Args('eventId', { type: () => Int }) eventId: number,
    @Args('quantity', { type: () => Int }) quantity: number,
  ): Promise<Order> {
    return this.orderService.purchaseTickets(eventId, quantity);
  }
}
