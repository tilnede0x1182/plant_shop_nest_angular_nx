import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

/**
 * Stratégie locale - authentification par email/password.
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' }); // on utilise email au lieu de username
  }

  /**
   * Valide les identifiants locaux.
   * @param email string Email de l"utilisateur
   * @param password string Mot de passe
   * @returns Promise<User> Utilisateur si valide
   * @throws UnauthorizedException Si invalide
   */
  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
