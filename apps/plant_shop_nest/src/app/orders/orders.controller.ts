// ==============================================================================
// Importations
// ==============================================================================
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
import { Request } from 'express';

// ==============================================================================
// Contrôleur
// ==============================================================================
/**
 * Contrôleur des commandes - gestion des ordres utilisateur.
 */
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /**
   * Liste les commandes de l'utilisateur courant.
   * @param req any Requête avec user injecté
   * @returns Promise<Order[]> Commandes de l'utilisateur
   */
  @Get()
  findAll(@Req() req: any) {
    const userId = req.user.id;
    return this.ordersService.findAll(userId);
  }

  //**
   * Crée une nouvelle commande.
   * @param data any Données de la commande (items)
   * @param req any Requête avec user injecté
   * @returns Promise<Order> Commande créée
   */
  @Post()
  create(@Body() data: any, @Req() req: any) {
    const user = req.user;
    return this.ordersService.create(data, user);
  }

  /**
   * Met à jour une commande (admin uniquement).
   * @param id string ID de la commande
   * @param data any Données à mettre à jour
   * @returns Promise<Order> Commande mise à jour
   */
  @Roles('admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.ordersService.update(+id, data);
  }

  /**
   * Supprime une commande (admin uniquement).
   * @param id string ID de la commande
   * @returns Promise<Order> Commande supprimée
   */
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
