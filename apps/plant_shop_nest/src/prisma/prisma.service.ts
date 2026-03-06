// ==============================================================================
// Importations
// ==============================================================================
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// ==============================================================================
// Service
// ==============================================================================
/**
 * Service Prisma - wrapper du client Prisma avec hooks NestJS.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  /**
   * Initialise la connexion à la base de données.
   * @returns Promise<void>
   */
  async onModuleInit() {
    await this.$connect();
  }

  /**
   * Active les hooks de fermeture propre de l'application.
   * @param app any Instance de l'application NestJS
   * @returns Promise<void>
   */
  async enableShutdownHooks(app: any) {
    this.$on('beforeExit' as any, async () => {
      await app.close();
    });
  }
}
