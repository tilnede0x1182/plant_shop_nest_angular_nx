import { Controller, Get, Req, Res, All } from '@nestjs/common';
import { Request, Response } from 'express';
import { join } from 'path';
import * as express from 'express';

@Controller('')
export class AngularController {
  private distFolder = join(
    process.cwd(),
    'dist/apps/plant-shop-angular-universal/browser'
  );

  constructor() {}

  @Get('')
  serveRoot(@Res() res: Response) {
    res.sendFile(join(this.distFolder, 'index.html'));
  }

  @All('*')
  serveAngular(@Req() req: Request, @Res() res: Response) {
    // Si l'URL commence par /api, on ne fait rien
    if (req.url.startsWith('/api')) {
      return;
    }

    // Sinon, on sert l'application Angular
    res.sendFile(join(this.distFolder, 'index.html'));
  }
}
