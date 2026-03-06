import { Injectable } from '@nestjs/common';

/**
 * Service principal - logique métier générale.
 */
@Injectable()
export class AppService {
  /**
   * Retourne un message de bienvenue.
   * @return Objet avec message
   */
  getData(): { message: string } {
    return { message: 'Hello API' };
  }
}
