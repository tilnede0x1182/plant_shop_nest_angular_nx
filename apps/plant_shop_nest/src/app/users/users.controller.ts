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
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

// ==============================================================================
// Contrôleur
// ==============================================================================
/**
 * Contrôleur des utilisateurs - gestion profils et administration.
 */
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Liste tous les utilisateurs (admin uniquement).
   * @returns Promise<User[]> Liste des utilisateurs
   */
  @Roles('admin')
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  /**
   * Détail d'un utilisateur (admin ou propriétaire).
   * @param id string ID de l'utilisateur
   * @param req any Requête avec user injecté
   * @returns Promise<User> Utilisateur trouvé
   * @throws ForbiddenException Si accès non autorisé
   */
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

  /**
   * Création d'un utilisateur (admin uniquement).
   * @param data any Données de l'utilisateur
   * @returns Promise<User> Utilisateur créé
   */
  @Roles('admin')
  @Post()
  create(@Body() data: any) {
    return this.usersService.create(data);
  }

  /**
   * Mise à jour d'un utilisateur (admin ou propriétaire).
   * @param id string ID de l'utilisateur
   * @param data any Données à mettre à jour
   * @param req any Requête avec user injecté
   * @returns Promise<User> Utilisateur mis à jour
   * @throws ForbiddenException Si accès non autorisé
   */
  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: any, @Req() req) {
    const userId = +id;
    const currentUser = req.user;

    // Admin → peut modifier n’importe qui
    if (currentUser.admin) {
      return this.usersService.update(userId, data);
    }

    // Utilisateur → peut modifier uniquement son propre profil
    if (currentUser.id === userId) {
      // Sécurité : empêcher qu’il force `admin: true`
      if ('admin' in data) delete data.admin;
      return this.usersService.update(userId, data);
    }

    throw new ForbiddenException('Accès refusé');
  }

  /**
   * Suppression d'un utilisateur (admin uniquement).
   * @param id string ID de l'utilisateur
   * @returns Promise<User> Utilisateur supprimé
   */
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
