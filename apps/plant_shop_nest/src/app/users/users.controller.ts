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
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

// # Contrôleur Users
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ✅ Réservé aux admins
  @Roles('admin')
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findOne(@Param('id') id: string, @Req() req) {
    const userId = +id;
    const currentUser = req.user;

    // Admin → accès OK
    if (currentUser.admin) {
      return this.usersService.findOne(userId);
    }

    // Utilisateur → accès seulement à son propre profil
    if (currentUser.id === userId) {
      return this.usersService.findOne(userId);
    }

    throw new ForbiddenException('Accès refusé');
  }

  // ✅ Accessible (register se fait déjà via AuthController),
  // mais un admin peut créer un utilisateur manuellement
  @Roles('admin')
  @Post()
  create(@Body() data: any) {
    return this.usersService.create(data);
  }

  // ✅ Réservé aux admins
  @Roles('admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.usersService.update(+id, data);
  }

  // ✅ Réservé aux admins
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
