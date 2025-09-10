import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AngularController } from './angular.controller';
import { join } from 'path';
import * as express from 'express';

@Module({
  controllers: [AngularController],
})
export class AngularModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Servir les fichiers statiques
    consumer
      .apply(
        express.static(
          join(process.cwd(), 'dist/apps/plant-shop-angular-universal/browser')
        )
      )
      .forRoutes('*');
  }
}
