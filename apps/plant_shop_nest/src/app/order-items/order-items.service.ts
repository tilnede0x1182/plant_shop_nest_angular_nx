import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderItemDto, UpdateOrderItemDto } from './dto/order-item.dto';
import { User } from '@prisma/client';

/**
 * Service métier OrderItems, accès base via Prisma.
 */
@Injectable()
export class OrderItemsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Liste tous les orderItems (inclut plante et commande).
   * @returns Promise<OrderItem[]> Liste des orderItems
   */
  async list() {
    return this.prisma.orderItem.findMany({
      include: { plant: true, order: true },
    });
  }

  /**
   * Récupère un orderItem par id.
   * @param id number Identifiant de l'orderItem
   * @returns Promise<OrderItem> OrderItem trouvé
   * @throws NotFoundException Si orderItem inexistant
   */
  async one(id: number) {
    const orderItem = await this.prisma.orderItem.findUnique({
      where: { id },
      include: { plant: true, order: true },
    });
    if (!orderItem) throw new NotFoundException('OrderItem non trouvé');
    return orderItem;
  }

  /**
   * findAll (alias de list pour cohérence).
   * @returns Promise<OrderItem[]> Liste des orderItems
   */
  async findAll() {
    return this.list();
  }

  /**
   * Recherche un item spécifique appartenant à un utilisateur.
   * @param id number Identifiant de l'item
   * @param user User Utilisateur connecté
   * @returns Promise<OrderItem> OrderItem trouvé
   * @throws NotFoundException Si orderItem inexistant
   */
  async findOneForUser(id: number, user: User) {
    const orderItem = await this.prisma.orderItem.findFirst({
      where: { id, order: { userId: user.id } },
      include: { plant: true, order: true },
    });
    if (!orderItem)
      throw new NotFoundException('OrderItem non trouvé pour cet utilisateur');
    return orderItem;
  }

  /**
   * Création d'un orderItem.
   * @param dto CreateOrderItemDto Données de l'orderItem
   * @param user User Utilisateur connecté
   * @returns Promise<OrderItem> OrderItem créé
   */
  async create(dto: CreateOrderItemDto, user: User) {
    // Approche 2 : Utiliser uniquement l'approche relationnelle
    return this.prisma.orderItem.create({
      data: {
        quantity: dto.quantity,
        plant: {
          connect: { id: dto.plantId },
        },
        order: {
          connect: { id: dto.orderId },
        },
      },
    });
  }

  /**
   * Mise à jour d'un orderItem (quantité).
   * @param id number Identifiant de l'orderItem
   * @param dto UpdateOrderItemDto Données mises à jour
   * @returns Promise<OrderItem> OrderItem mis à jour
   */
  async update(id: number, dto: UpdateOrderItemDto) {
    return this.prisma.orderItem.update({ where: { id }, data: dto });
  }

  /**
   * Suppression d'un orderItem.
   * @param id number Identifiant de l'orderItem
   * @returns Promise<OrderItem> OrderItem supprimé
   */
  async remove(id: number) {
    return this.prisma.orderItem.delete({ where: { id } });
  }
}
