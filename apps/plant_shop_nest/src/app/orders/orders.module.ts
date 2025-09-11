// # Importations
import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

// # Module Commandes
@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
