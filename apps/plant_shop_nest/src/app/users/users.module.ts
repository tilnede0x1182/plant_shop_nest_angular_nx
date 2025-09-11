// # Importations
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

// # Module Utilisateurs
@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
