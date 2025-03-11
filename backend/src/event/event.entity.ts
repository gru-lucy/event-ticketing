import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Represents an event with its details in the system.
 * This class is linked to a database table where each event record
 * is stored with unique id, name, date, total number of tickets,
 * and the number of tickets currently available.
 */
@Entity()
export class Event {
  /*
     Unique identifier for each event.
    */
  @PrimaryGeneratedColumn()
  id: number;

  /*
     Name of the event.
    */
  @Column()
  name: string;

  /*
     Date when the event is scheduled.
    */
  @Column()
  date: Date;

  /*
     Total number of tickets issued for the event.
    */
  @Column()
  totalTickets: number;

  /*
     Number of tickets available for purchase.
    */
  @Column()
  availableTickets: number;
}
