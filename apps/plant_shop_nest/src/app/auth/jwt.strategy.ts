// ==============================================================================
// Importations
// ==============================================================================
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

// ==============================================================================
// Stratégie
// ==============================================================================
/**
 * Stratégie JWT - extrait et valide le token depuis les cookies.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // Lecture d'abord dans le cookie
        (req: Request) => {
          if (req && req.cookies) {
            return req.cookies['jwt'];
          }
          return null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secret_dev',
    });
  }

  /**
   * Valide le payload JWT et retourne les infos user.
   * @param payload any Payload décodé du JWT
   * @returns Promise<User> Données utilisateur pour req.user
   */
  async validate(payload: any) {
    // Retourne les infos utiles du user dans req.user
    return {
      id: payload.sub,
      email: payload.email,
      admin: payload.admin,
      name: payload.name,
    };
  }
}
