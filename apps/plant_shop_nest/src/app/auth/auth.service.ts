// # Importations
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

/**
 * Service d'authentification - validation, JWT, inscription.
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  /**
   * Inscription d'un nouvel utilisateur.
   */
  async register(email: string, password: string, name?: string) {
    const hashed = await bcrypt.hash(password, 10);
    const utilisateur = await this.usersService.create({
      email,
      password: hashed,
      name,
    });

    return {
      id: utilisateur.id,
      email: utilisateur.email,
      name: utilisateur.name,
      admin: utilisateur.admin,
    };
  }

  /**
   * Valide les identifiants d'un utilisateur.
   */
  async validateUser(email: string, password: string) {
    const utilisateur = await this.usersService.findByEmail(email);
    if (!utilisateur) throw new UnauthorizedException('Utilisateur inexistant');
    const valide = await bcrypt.compare(password, utilisateur.password);
    if (!valide) throw new UnauthorizedException('Mot de passe invalide');

    return utilisateur;
  }

  /**
   * Générer un JWT pour un utilisateur
   */
  async login(utilisateur: any) {
    const payload = {
      sub: utilisateur.id,
      email: utilisateur.email,
      admin: utilisateur.admin,
      name: utilisateur.name,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: utilisateur,
    };
  }
}
