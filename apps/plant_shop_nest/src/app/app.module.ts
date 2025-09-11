import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AngularModule } from './angular/angular.module';
import { PrismaModule } from '../prisma/prisma.module'; // Changer ceci
import { UsersModule } from './users/users.module';
import { PlantsModule } from './plants/plants.module';
import { OrdersModule } from './orders/orders.module';
import { OrderItemsModule } from './order-items/order-items.module';

@Module({
  imports: [
    AngularModule,
    PrismaModule, // Utiliser le module ici
    UsersModule,
    PlantsModule,
    OrdersModule,
    OrderItemsModule,
  ],
  controllers: [AppController],
  providers: [AppService], // Supprimer PrismaService d'ici
})
export class AppModule {}
