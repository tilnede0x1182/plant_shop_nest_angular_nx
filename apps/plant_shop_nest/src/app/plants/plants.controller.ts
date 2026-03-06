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
} from '@nestjs/common';
import { PlantsService } from './plants.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

// ==============================================================================
// Contrôleur
// ==============================================================================
/**
 * Contrôleur des plantes - endpoints publics et admin.
 */
@Controller('plants')
export class PlantsController {
  constructor(private readonly plantsService: PlantsService) {}

  /**
   * Liste toutes les plantes disponibles (public).
   * @returns Promise<Plant[]> Liste des plantes
   */
  @Get()
  findAll() {
    return this.plantsService.findAll();
  }

  /**
   * Détail d'une plante par id (public).
   * @param id string ID de la plante
   * @returns Promise<Plant> Plante trouvée
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.plantsService.findOne(+id);
  }

  /**
   * Création d'une plante (admin uniquement).
   * @param data any Données de la plante
   * @returns Promise<Plant> Plante créée
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  create(@Body() data: any) {
    return this.plantsService.create(data);
  }

  /**
   * Mise à jour d'une plante (admin uniquement).
   * @param id string ID de la plante
   * @param data any Données à mettre à jour
   * @returns Promise<Plant> Plante mise à jour
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.plantsService.update(+id, data);
  }

  /**
   * Suppression d'une plante (admin uniquement).
   * @param id string ID de la plante
   * @returns Promise<Plant> Plante supprimée
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.plantsService.remove(+id);
  }
}
