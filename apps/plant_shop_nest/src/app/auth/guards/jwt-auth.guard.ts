// ==============================================================================
// Importations
// ==============================================================================
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

// ==============================================================================
// Guard
// ==============================================================================
/**
 * Guard JWT avec gestion des routes publiques et redirections.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private publicRoutes: string[] = [
    '/',
    '/plants',
    '/auth/login',
    '/auth/register',
    '/cart',
    '/favicon.ico',
  ];

  /**
   * Vérifie si la route nécessite authentification.
   * @param context ExecutionContext Contexte d'exécution NestJS
   * @returns boolean|Promise<boolean> True si accès autorisé
   */
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const path: string = req.path;

    // 1. Autoriser TOUS les fichiers statiques (favicon, js, css, etc.)
    if (path.includes('.')) {
      return true;
    }

    // 2. Autoriser les routes publiques
    if (
      this.publicRoutes.some(
        (route) =>
          path === route || (route === '/plants' && path.startsWith('/plants/'))
      )
    ) {
      return true;
    }

    return super.canActivate(context);
  }

  /**
   * Gère la requête après validation du JWT.
   * @param err any Erreur éventuelle
   * @param user any Utilisateur décodé
   * @param info any Infos supplémentaires
   * @param context ExecutionContext Contexte d'exécution
   * @returns any Utilisateur ou redirection
   */
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse<Response>();
    const path: string = req.path;

    // ✅ pas connecté et route non publique → redirection login
    if (!user && !this.publicRoutes.includes(path)) {
      res.redirect('/auth/login');
      return;
    }

    // ✅ connecté mais pas admin et accès /admin/* → redirection vers /plants
    if (user && !user.admin && path.startsWith('/admin')) {
      res.redirect('/plants');
      return;
    }

    // ✅ sinon, on renvoie l’utilisateur tel quel
    return user;
  }
}
