// import { Logger, ValidationPipe } from '@nestjs/common';
// import { NestFactory } from '@nestjs/core';

// import { AppModule } from './app/app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   app.use((req, res, next) => {
//     console.log('[Nest DEBUG main.ts] incoming →', req.method, req.url);
//     next();
//   });

//   // Préfixe strictement limité à /api/*
//   app.setGlobalPrefix('api');

//   // En mode SSR, servir les assets Angular
//   if (process.env.SERVE_SSR === 'true') {
//     const express = require('express');
//     const { join } = require('path');
//     const browserDist = join(
//       process.cwd(),
//       'dist/apps/plant-shop-angular-universal/browser'
//     );
//     app.use(express.static(browserDist));
//   }

//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true,
//       forbidNonWhitelisted: true,
//       transform: true,
//     })
//   );

//   // Configurez CORS pour le développement
//   app.enableCors({
//     origin: [
//       'http://localhost:8300',
//       'http://localhost:3000',
//       'http://localhost:4150',
//     ],
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials: true,
//   });

//   const port = process.env.PORT || 3000;
//   await app.listen(port);

//   Logger.log(`🚀 Application is running on: http://localhost:${port}/`);

//   // Fallback SSR
//   if (process.env.SERVE_SSR === 'true') {
//     const { join } = require('path');
//     const server: import('express').Express = app
//       .getHttpAdapter()
//       .getInstance();
//     const distFolder = join(
//       process.cwd(),
//       'dist/apps/plant-shop-angular-universal/browser'
//     );
//     const indexHtml = join(distFolder, 'index.html');

//     // N’intercepter que les GET non-API et non-fichiers statiques
//     server.use((req, res, next) => {
//       console.log('[SSR Middleware] incoming →', req.method, req.url);
//       if (req.method !== 'GET') return next();
//       if (req.url.startsWith('/api/')) return next();
//       if (req.url.match(/\.(js|css|ico|png|jpg|jpeg|gif|svg|webp|woff2?|ttf)$/))
//         return next();

//       console.log('[SSR Middleware] serve index.html for', req.url);
//       res.sendFile(indexHtml);
//     });
//   }
// }

// bootstrap();





// apps/plant_shop_nest/src/main.ts

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const server: express.Express = app.getHttpAdapter().getInstance();

  // Log pour le débogage (vous pouvez le retirer en production finale)
  app.use((req, res, next) => {
    console.log(`[Nest DEBUG] Requête entrante → ${req.method} ${req.url}`);
    next();
  });

  // Étape A : Définir le préfixe de l'API
  // Toutes les routes de vos contrôleurs Nest commenceront par /api.
  app.setGlobalPrefix('api');

  // Étape B : Configuration du SSR (uniquement si la variable d'environnement est activée)
  if (process.env.SERVE_SSR === 'true') {
    const browserDist = join(
      process.cwd(),
      'dist/apps/plant-shop-angular-universal/browser'
    );
    const indexHtml = join(browserDist, 'index.html');

    // 2a. Servir les fichiers statiques d'Angular (JS, CSS, images...).
    // Ce middleware est prioritaire et répondra avant le fallback.
    server.use(express.static(browserDist, { maxAge: '1y', index: false }));

    // 2b. Le fallback SSR pour les routes du frontend Angular.
    // ====================== MODIFICATION IMPORTANTE ICI ======================
    // On remplace '*' par une expression régulière qui intercepte tout SAUF /api.
    // C'est la correction pour l'erreur "PathError: Missing parameter name".
    server.get(
      /^(?!\/api).*/,
      (req: express.Request, res: express.Response) => {
        console.log(
          `[SSR Fallback] La requête pour "${req.originalUrl}" n'est ni une API, ni un asset. Service de index.html.`
        );
        res.sendFile(indexHtml);
      }
    );
    // =========================================================================
  }

  // Configuration globale des pipes et de CORS
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  app.enableCors({
    origin: [
      'http://localhost:8300', // Port dev Angular
      'http://localhost:3000',
      'http://localhost:4150', // Port prod SSR
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  // Étape C : Démarrage du serveur
  const port = process.env.PORT || 3000;
  await app.listen(port);

  Logger.log(`🚀 Application démarrée sur: http://localhost:${port}`);
}

bootstrap();
