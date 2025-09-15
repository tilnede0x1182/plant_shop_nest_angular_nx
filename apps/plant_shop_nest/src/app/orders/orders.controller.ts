// # Importations
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

// # Contrôleur Orders
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // ✅ Un admin voit toutes les commandes
  @Roles('admin')
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  // ✅ Un utilisateur voit seulement ses propres commandes
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    const user = req.user;
    return this.ordersService.findOneForUser(+id, user);
  }

  // ✅ Tout utilisateur authentifié peut créer une commande
  @Post()
  create(@Body() data: any, @Req() req: any) {
    const user = req.user;
    return this.ordersService.create(data, user);
  }

  // ✅ Un admin peut mettre à jour une commande (ex. statut)
  @Roles('admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.ordersService.update(+id, data);
  }

  // ✅ Un admin peut supprimer une commande
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
