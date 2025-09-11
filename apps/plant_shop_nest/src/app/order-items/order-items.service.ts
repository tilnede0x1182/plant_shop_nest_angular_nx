// # Importations
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderItemDto, UpdateOrderItemDto } from './dto/order-item.dto';

/**
  Service métier OrderItems, accès base via Prisma
  @constructor PrismaService service Prisma injecté
*/
@Injectable()
export class OrderItemsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
	  Liste tous les orderItems (inclut plante et commande)
	*/
  async list() {
    return this.prisma.orderItem.findMany({
      include: { plant: true, order: true },
    });
  }

  /**
	  Récupère un orderItem par id
	  @id identifiant numérique orderItem
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
	  Création orderItem
	  @dto données orderItem
	*/
  async create(dto: CreateOrderItemDto) {
    return this.prisma.orderItem.create({ data: dto });
  }

  /**
	  Mise à jour orderItem (quantité)
	  @id identifiant orderItem
	  @dto données mises à jour
	*/
  async update(id: number, dto: UpdateOrderItemDto) {
    return this.prisma.orderItem.update({ where: { id }, data: dto });
  }

  /**
	  Suppression orderItem
	  @id identifiant orderItem
	*/
  async remove(id: number) {
    return this.prisma.orderItem.delete({ where: { id } });
  }
}
