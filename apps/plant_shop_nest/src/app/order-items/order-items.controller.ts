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
import { OrderItemsService } from './order-items.service';
import { CreateOrderItemDto, UpdateOrderItemDto } from './dto/order-item.dto';

/**
  Contrôleur OrderItems, routes REST CRUD
  @constructor OrderItemsService service métier injecté
*/
@Controller('order-items')
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemsService) {}

  /** GET /order-items : liste tous les orderItems */
  @Get()
  list() {
    return this.orderItemsService.list();
  }

  /** GET /order-items/:id : détail d'un orderItem */
  @Get(':id')
  one(@Param('id', ParseIntPipe) id: number) {
    return this.orderItemsService.one(id);
  }

  /** POST /order-items : création d'un orderItem */
  @Post()
  create(@Body() dto: CreateOrderItemDto) {
    return this.orderItemsService.create(dto);
  }

  /** PATCH /order-items/:id : maj d'un orderItem */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderItemDto
  ) {
    return this.orderItemsService.update(id, dto);
  }

  /** DELETE /order-items/:id : suppression d'un orderItem */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.orderItemsService.remove(id);
  }
}
