import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePlantDto, UpdatePlantDto } from './dto/plant.dto';

/**
 * Service métier des plantes, accès base via Prisma.
 */
@Injectable()
export class PlantsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retourne toutes les plantes disponibles (stock >= 1).
   * @returns Promise<Plant[]> Plantes en stock
   */
  async list() {
    return this.prisma.plant.findMany({
      where: { stock: { gte: 1 } },
      orderBy: { name: 'asc' },
    });
  }

  /**
   * findAll (alias de list).
   * @returns Promise<Plant[]> Plantes en stock
   */
  async findAll() {
    return this.list();
  }

  /**
   * Retourne une plante par id.
   * @param id number Identifiant de la plante
   * @returns Promise<Plant> Plante trouvée
   * @throws NotFoundException Si plante inexistante
   */
  async one(id: number) {
    const plant = await this.prisma.plant.findUnique({ where: { id } });
    if (!plant) throw new NotFoundException('Plante non trouvée');
    return plant;
  }

  /**
   * findOne (alias de one).
   * @param id number Identifiant de la plante
   * @returns Promise<Plant> Plante trouvée
   */
  async findOne(id: number) {
    return this.one(id);
  }

  /**
   * Création d'une plante.
   * @param dto CreatePlantDto Données de la plante
   * @returns Promise<Plant> Plante créée
   */
  async create(dto: CreatePlantDto) {
    return this.prisma.plant.create({ data: dto });
  }

  /**
   * Mise à jour d'une plante.
   * @param id number Identifiant de la plante
   * @param dto UpdatePlantDto Données mises à jour
   * @returns Promise<Plant> Plante mise à jour
   */
  async update(id: number, dto: UpdatePlantDto) {
    return this.prisma.plant.update({ where: { id }, data: dto });
  }

  /**
   * Suppression d'une plante.
   * @param id number Identifiant de la plante
   * @returns Promise<Plant> Plante supprimée
   */
  async remove(id: number) {
    return this.prisma.plant.delete({ where: { id } });
  }
}
