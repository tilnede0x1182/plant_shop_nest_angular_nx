import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Préfixe strictement limité à /api/*
  app.setGlobalPrefix('api');

  // En mode SSR, servir les assets Angular
  if (process.env.SERVE_SSR === 'true') {
    const express = require('express');
    const { join } = require('path');
    const browserDist = join(
      process.cwd(),
      'dist/apps/plant-shop-angular-universal/browser'
    );
    app.use(express.static(browserDist));
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // Configurez CORS pour le développement
  app.enableCors({
    origin: [
      'http://localhost:8300',
      'http://localhost:4200',
      'http://localhost:3000',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  Logger.log(`🚀 Application is running on: http://localhost:${port}/`);
}

bootstrap();
