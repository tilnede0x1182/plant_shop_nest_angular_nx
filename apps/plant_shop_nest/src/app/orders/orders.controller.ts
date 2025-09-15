// # Importations
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderDto } from './dto/order.dto';

/**
  Contrôleur Commandes, routes REST CRUD
  @constructor OrdersService service métier injecté
*/
@Controller('/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /** GET /orders : liste toutes les commandes */
  @Get()
  list() {
    return this.ordersService.list();
  }

  /** GET /orders/:id : détail d'une commande */
  @Get(':id')
  one(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.one(id);
  }

  /** POST /orders : création d'une commande */
  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }

  /** PATCH /orders/:id : maj d'une commande */
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateOrderDto) {
    return this.ordersService.update(id, dto);
  }

  /** DELETE /orders/:id : suppression d'une commande */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.remove(id);
  }
}
