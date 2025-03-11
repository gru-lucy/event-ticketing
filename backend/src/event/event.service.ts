import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';

@Injectable()
export class EventService {
  /*
     Constructor to inject the Event repository.
     @param eventRepository - The repository handling Event entity operations.
    */
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  /*
     Retrieves all events from the database.
     @returns A promise resolving to an array of Event objects.
    */
  async findAll(): Promise<Event[]> {
    return await this.eventRepository.find();
  }

  /*
     Finds a single event by its ID.
     @param id - The unique identifier of the event.
     @returns A promise resolving to the Event object or null if not found.
    */
  async findOne(id: number): Promise<Event | null> {
    return await this.eventRepository.findOneBy({ id });
  }

  /*
     Creates a new event in the database.
     @param data - Partial event data used to create an event.
     @returns A promise resolving to the created Event object.
    */
  async createEvent(data: Partial<Event>): Promise<Event> {
    const event = this.eventRepository.create(data);
    return this.eventRepository.save(event);
  }

  /*
     Decreases the available ticket count for an event.
     @param eventId - The unique identifier of the event.
     @param quantity - The number of tickets to decrease.
     @returns A promise resolving to the updated Event object.
     @throws Error if the event is not found or if there are not enough tickets available.
    */
  async decreaseTickets(eventId: number, quantity: number): Promise<Event> {
    const event = await this.findOne(eventId);
    if (!event) {
      throw new Error('Event not found');
    }
    if (event.availableTickets < quantity) {
      throw new Error('Not enough tickets available');
    }
    event.availableTickets -= quantity;
    return this.eventRepository.save(event);
  }
}
