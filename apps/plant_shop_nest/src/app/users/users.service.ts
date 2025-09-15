// # Importations
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcryptjs';

/**
  Service métier des utilisateurs, accès base via Prisma
  @constructor PrismaService service Prisma injecté
*/
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
    Liste tous les utilisateurs (admins d'abord, tri par nom)
  */
  async list() {
    return this.prisma.user.findMany({
      orderBy: [{ admin: 'desc' }, { name: 'asc' }],
    });
  }

  /**
    findAll (alias de list)
  */
  async findAll() {
    return this.list();
  }

  /**
    Récupère un utilisateur par id
    @id identifiant numérique utilisateur
  */
  async one(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Utilisateur non trouvé');
    return user;
  }

  /**
    findOne (alias de one)
  */
  async findOne(id: number) {
    return this.one(id);
  }

  /**
    Création utilisateur (mot de passe hashé)
    @dto données utilisateur
  */
  async create(dto: CreateUserDto) {
    const data = { ...dto, password: await bcrypt.hash(dto.password, 10) };
    return this.prisma.user.create({ data });
  }

  /**
    Mise à jour utilisateur
    @id identifiant utilisateur
    @dto données mises à jour (hash password si présent)
  */
  async update(id: number, dto: UpdateUserDto) {
    const data = { ...dto };
    if (data.password) data.password = await bcrypt.hash(data.password, 10);
    return this.prisma.user.update({ where: { id }, data });
  }

  /**
    Suppression utilisateur
    @id identifiant utilisateur
  */
  async remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }

  /**
    Cherche un utilisateur par email
    @param email email utilisateur
  */
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
