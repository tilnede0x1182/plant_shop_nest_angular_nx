import {
  Controller,
  Get,
  Delete,
  Param,
  UseGuards,
  Post,
  Patch,
  Body,
} from '@nestjs/common';
import { PlantsService } from './plants.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

/**
 * Contrôleur Admin Plants - CRUD plantes (admin uniquement).
 */
@Controller('admin/plants')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminPlantsController {
  constructor(private readonly plantsService: PlantsService) {}

  /**
   * Liste toutes les plantes (admin).
   * @returns Promise<Plant[]> Liste des plantes
   */
  @Get()
  @Roles('admin')
  findAll() {
    return this.plantsService.findAll();
  }

  /**
   * Crée une plante (admin).
   * @param data any Données de la plante
   * @returns Promise<Plant> Plante créée
   */
  @Post()
  @Roles('admin')
  create(@Body() data: any) {
    return this.plantsService.create(data);
  }

  /**
   * Met à jour une plante (admin).
   * @param id string ID de la plante
   * @param data any Données à mettre à jour
   * @returns Promise<Plant> Plante mise à jour
   */
  @Patch(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() data: any) {
    return this.plantsService.update(+id, data);
  }

  /**
   * Supprime une plante (admin).
   * @param id string ID de la plante
   * @returns Promise<Plant> Plante supprimée
   */
  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.plantsService.remove(+id);
  }
}
