// ==============================================================================
// Importations
// ==============================================================================
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

// ==============================================================================
// Guard
// ==============================================================================
/**
 * Guard de rôles - vérifie que l"utilisateur a le rôle requis.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * Vérifie si l"utilisateur a les rôles requis.
   * @param context ExecutionContext Contexte d"exécution NestJS
   * @returns boolean True si autorisé
   */
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );
    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.includes('admin') ? user?.admin === true : true;
  }
}
