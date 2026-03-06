// ==============================================================================
// Importations
// ==============================================================================
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

// ==============================================================================
// Contrôleur
// ==============================================================================
/**
 * Contrôleur principal - routes de test.
 */
@Controller('')
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Route de test retournant un message de bienvenue.
   * @return Objet avec message
   */
  @Get('hello')
  getData() {
    return this.appService.getData();
  }
}
