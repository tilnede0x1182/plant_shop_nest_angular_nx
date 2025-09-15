// # Importations
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

// # Service d'authentification
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  /**
   * Valider un utilisateur via email/mot de passe
   */
  async validateUser(email: string, mot_de_passe: string) {
    const utilisateur = await this.usersService.findByEmail(email);
    if (!utilisateur)
      throw new UnauthorizedException('Utilisateur introuvable');

    const valide = await bcrypt.compare(mot_de_passe, utilisateur.password);
    if (!valide) throw new UnauthorizedException('Mot de passe invalide');

    const { password, ...resultat } = utilisateur;
    return resultat;
  }

  /**
   * Générer un JWT pour un utilisateur
   */
  async login(utilisateur: any) {
    const payload = {
      sub: utilisateur.id,
      email: utilisateur.email,
      admin: utilisateur.admin,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: utilisateur,
    };
  }
}
