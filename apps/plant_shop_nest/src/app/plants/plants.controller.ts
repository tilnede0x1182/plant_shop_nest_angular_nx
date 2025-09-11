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
import { PlantsService } from './plants.service';
import { CreatePlantDto, UpdatePlantDto } from './dto/plant.dto';

/**
  Contrôleur Plantes, routes REST CRUD
  @constructor PlantsService service métier injecté
*/
@Controller('plants')
export class PlantsController {
  constructor(private readonly plantsService: PlantsService) {}

  /** GET /plants : liste toutes les plantes */
  @Get()
  list() {
    return this.plantsService.list();
  }

  /** GET /plants/:id : détail d'une plante */
  @Get(':id')
  one(@Param('id', ParseIntPipe) id: number) {
    return this.plantsService.one(id);
  }

  /** POST /plants : création d'une plante */
  @Post()
  create(@Body() dto: CreatePlantDto) {
    return this.plantsService.create(dto);
  }

  /** PATCH /plants/:id : maj d'une plante */
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePlantDto) {
    return this.plantsService.update(id, dto);
  }

  /** DELETE /plants/:id : suppression d'une plante */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.plantsService.remove(id);
  }
}
