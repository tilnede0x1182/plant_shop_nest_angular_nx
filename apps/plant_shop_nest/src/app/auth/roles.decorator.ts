// ==============================================================================
// Importations
// ==============================================================================
import { SetMetadata } from '@nestjs/common';

// ==============================================================================
// Données
// ==============================================================================
/** Clé pour les métadonnées de rôles */
export const ROLES_KEY = 'roles';

// ==============================================================================
// Décorateur
// ==============================================================================
/**
 * Décorateur pour définir les rôles requis.
 * @param roles string[] Liste des rôles autorisés
 * @returns Décorateur NestJS
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
