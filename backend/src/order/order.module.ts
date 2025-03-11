import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { OrderService } from './order.service';
import { OrderResolver } from './order.resolver';
import { EventModule } from '../event/event.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), EventModule],
  providers: [OrderService, OrderResolver],
})
export class OrderModule {}
