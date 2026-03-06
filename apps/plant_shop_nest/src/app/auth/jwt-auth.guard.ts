// ==============================================================================
// Importations
// ==============================================================================
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// ==============================================================================
// Guard
// ==============================================================================
/**
 * Guard JWT - protège les routes nécessitant une authentification.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
