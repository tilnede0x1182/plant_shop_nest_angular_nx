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
} from '@nestjs/common';
import { PlantsService } from './plants.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

// # Contrôleur Plants
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('plants')
export class PlantsController {
  constructor(private readonly plantsService: PlantsService) {}

  // ✅ Accessible à tout utilisateur connecté
  @Get()
  findAll() {
    return this.plantsService.findAll();
  }

  // ✅ Accessible à tout utilisateur connecté
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.plantsService.findOne(+id);
  }

  // ✅ Réservé aux admins
  @Roles('admin')
  @Post()
  create(@Body() data: any) {
    return this.plantsService.create(data);
  }

  // ✅ Réservé aux admins
  @Roles('admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.plantsService.update(+id, data);
  }

  // ✅ Réservé aux admins
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.plantsService.remove(+id);
  }
}
