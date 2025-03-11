import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Event } from '../event/event.entity';

/**
 * Represents an order placed for an event.
 * This entity is linked to a database table storing order records,
 * including the order number, quantity of tickets purchased,
 * the associated event, and the order creation timestamp.
 */
@Entity()
export class Order {
  /*
     Unique identifier for each order.
    */
  @PrimaryGeneratedColumn()
  id: number;

  /*
     Unique order number assigned to the purchase.
    */
  @Column()
  orderNumber: string;

  /*
     Number of tickets purchased in this order.
    */
  @Column()
  quantity: number;

  /*
     The event associated with this order.
     Establishes a many-to-one relationship with the Event entity.
    */
  @ManyToOne(() => Event)
  @JoinColumn()
  event: Event;

  /*
     Timestamp when the order was created.
     Defaults to the current timestamp upon record creation.
    */
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
