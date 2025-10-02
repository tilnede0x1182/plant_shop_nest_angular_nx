// import { Controller, Get, Req, Res, All, Next } from '@nestjs/common';
// import { Request, Response } from 'express';
// import { join } from 'path';
// import * as express from 'express';

// const isSSR = process.env.SERVE_SSR === 'true';

// @Controller('')
// export class AngularController {
//   private distFolder = join(
//     process.cwd(),
//     'dist/apps/plant-shop-angular-universal/browser'
//   );

//   constructor() {}

//   @Get()
//   serveRoot(@Res() res: Response) {
//     if (!isSSR) return res.status(404).send('Not Found');
//     res.sendFile(join(this.distFolder, 'index.html'));
//   }

//   @All('*')
//   serveAngular(
//     @Req() req: Request,
//     @Res() res: Response,
//     @Next() next: () => void
//   ) {
//     if (!isSSR) return next(); // dev → on laisse passer

//     const url = req.url;

//     // Laisser passer API
//     if (url.startsWith('/api')) {
//       console.log('[AngularController] laisse passer API', url);
//       return next();
//     }
//     // Laisser passer les assets statiques
//     if (url.match(/\.(?:js|css|ico|png|jpg|jpeg|gif|svg|webp|woff2?|ttf)$/)) {
//       console.log('[AngularController] laisse passer asset', url);
//       return next();
//     }

//     // Sinon, SSR
//     console.log('[AngularController] SSR Angular index.html pour', url);
//     return res.sendFile(join(this.distFolder, 'index.html'));
//   }
// }
