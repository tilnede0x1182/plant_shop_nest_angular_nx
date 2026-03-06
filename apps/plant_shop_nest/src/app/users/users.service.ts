// ==============================================================================
// Importations
// ==============================================================================
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcryptjs';

// ==============================================================================
// Service
// ==============================================================================
/**
 * Service métier des utilisateurs, accès base via Prisma.
 */
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Liste tous les utilisateurs (admins d'abord, tri par nom).
   * @returns Promise<User[]> Liste des utilisateurs
   */
  async list() {
    return this.prisma.user.findMany({
      orderBy: [{ admin: 'desc' }, { name: 'asc' }],
    });
  }

  /**
   * findAll (alias de list).
   * @returns Promise<User[]> Liste des utilisateurs
   */
  async findAll() {
    return this.list();
  }

  /**
   * Récupère un utilisateur par id.
   * @param id number Identifiant de l'utilisateur
   * @returns Promise<User> Utilisateur trouvé
   * @throws NotFoundException Si utilisateur inexistant
   */
  async one(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Utilisateur non trouvé');
    return user;
  }

  /**
   * findOne (alias de one).
   * @param id number Identifiant de l'utilisateur
   * @returns Promise<User> Utilisateur trouvé
   */
  async findOne(id: number) {
    return this.one(id);
  }

  /**
   * Création d'un utilisateur.
   * @param dto CreateUserDto Données de l'utilisateur
   * @returns Promise<User> Utilisateur créé
   */
  async create(dto: CreateUserDto) {
    const user = await this.prisma.user.create({ data: dto });
    return user;
  }

  /**
   * Recherche un utilisateur par email.
   * @param email string Adresse email
   * @returns Promise<User|null> Utilisateur trouvé ou null
   */
  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user;
  }

  /**
   * Suppression d'un utilisateur.
   * @param id number Identifiant de l'utilisateur
   * @returns Promise<User> Utilisateur supprimé
   */
  async remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }

  /**
   * Mise à jour d'un utilisateur.
   * @param id number Identifiant de l'utilisateur
   * @param dto UpdateUserDto Données à mettre à jour
   * @returns Promise<User> Utilisateur mis à jour
   */
  async update(id: number, dto: UpdateUserDto) {
    const user = await this.prisma.user.update({ where: { id }, data: dto });
    return user;
  }
}
