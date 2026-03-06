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
import { OrderItemsService } from './order-items.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

/**
 * Contrôleur OrderItems - gestion des items de commande.
 */
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('order-items')
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemsService) {}

  /**
   * Liste tous les order-items (admin uniquement).
   * @returns Promise<OrderItem[]> Liste des order-items
   */
  @Roles('admin')
  @Get()
  findAll() {
    return this.orderItemsService.findAll();
  }

  /**
   * Détail d'un order-item (propriétaire ou admin).
   * @param id string ID de l'order-item
   * @param req any Requête avec user injecté
   * @returns Promise<OrderItem> Order-item trouvé
   */
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    const user = req.user;
    return this.orderItemsService.findOneForUser(+id, user);
  }

  //**
   * Crée un order-item.
   * @param data any Données de l'item
   * @param req any Requête avec user injecté
   * @returns Promise<OrderItem> Order-item créé
   */
  @Post()
  create(@Body() data: any, @Req() req: any) {
    const user = req.user;
    return this.orderItemsService.create(data, user);
  }

  /**
   * Mise à jour d'un order-item (admin uniquement).
   * @param id string ID de l'order-item
   * @param data any Données à mettre à jour
   * @returns Promise<OrderItem> Order-item mis à jour
   */
  @Roles('admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.orderItemsService.update(+id, data);
  }

  /**
   * Suppression d'un order-item (admin uniquement).
   * @param id string ID de l'order-item
   * @returns Promise<OrderItem> Order-item supprimé
   */
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderItemsService.remove(+id);
  }
}
