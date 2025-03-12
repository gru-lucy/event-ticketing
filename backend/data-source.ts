import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Event } from './src/event/event.entity';
import { Order } from './src/order/order.entity';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'event-ticketing',
  synchronize: false,
  logging: false,
  entities: [Event, Order],
  migrations: ['src/migrations/*{.ts,.js}'],
});
