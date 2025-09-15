// # Importations
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// # Guard basé sur JWT
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
