import { Controller, Get, Req, Res, All } from '@nestjs/common';
import { Request, Response } from 'express';
import { join } from 'path';
import * as express from 'express';

const isSSR = process.env.SERVE_SSR === 'true';

@Controller('')
export class AngularController {
  private distFolder = join(
    process.cwd(),
    'dist/apps/plant-shop-angular-universal/browser'
  );

  constructor() {}

  @Get()
  serveRoot(@Res() res: Response) {
    if (!isSSR) return res.status(404).send('Not Found');
    res.sendFile(join(this.distFolder, 'index.html'));
  }

  @All('*')
  serveAngular(@Req() req: Request, @Res() res: Response) {
    if (!isSSR) {
      return res.status(404).send('Not Found');
    }

    const url = req.url;

    // Laisser passer API et assets statiques (js, css, images, icônes)
    if (
      url.startsWith('/api') ||
      url.match(/\.(?:js|css|ico|png|jpg|jpeg|gif|svg|webp|woff2?|ttf)$/)
    ) {
      return;
    }

    // Tout le reste → SSR Angular
    return res.sendFile(join(this.distFolder, 'index.html'));
  }
}
