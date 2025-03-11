import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { EventService } from '../event/event.service';

/**
 * Service class for handling order-related operations.
 * This service manages ticket purchases, order creation, and order number generation.
 */
@Injectable()
export class OrderService {
  /*
     Constructor to inject the Order repository and EventService.
     @param orderRepository - The repository handling Order entity operations.
     @param eventService - The service handling event-related operations.
    */
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private eventService: EventService,
  ) {}

  /*
     Handles ticket purchase for a given event.
     @param eventId - The unique identifier of the event.
     @param quantity - The number of tickets to purchase.
     @returns A promise resolving to the created Order object.
     @throws Error if the event is not found or if there are not enough tickets available.
    */
  async purchaseTickets(eventId: number, quantity: number): Promise<Order> {
    const event = await this.eventService.findOne(eventId);
    if (!event) {
      throw new Error('Event not found');
    }
    if (event.availableTickets < quantity) {
      throw new Error('Not enough tickets available');
    }
    // Decrease ticket count
    await this.eventService.decreaseTickets(eventId, quantity);
    // Create an order
    const order = new Order();
    order.orderNumber = this.generateOrderNumber();
    order.quantity = quantity;
    order.event = event;
    return this.orderRepository.save(order);
  }

  /*
     Generates a unique order number.
     Uses the current timestamp and a random number to ensure uniqueness.
     @returns A generated order number in the format "ORD-{timestamp}-{random_number}".
    */
  generateOrderNumber(): string {
    return `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
}
