import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Event } from './src/event/event.entity';
import { Order } from './src/order/order.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'event-ticketing',
  synchronize: false,
  logging: false,
  entities: [Event, Order],
  migrations: ['src/migrations/*{.ts,.js}'],
});
