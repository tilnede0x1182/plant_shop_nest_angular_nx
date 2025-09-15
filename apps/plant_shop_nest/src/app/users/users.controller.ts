// # Importations
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

/**
  Contrôleur Utilisateurs, routes REST CRUD
  @constructor UsersService service métier injecté
*/
@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /** GET /users : liste tous les utilisateurs */
  @Get()
  list() {
    return this.usersService.list();
  }

  /** GET /users/:id : détail d'un utilisateur */
  @Get(':id')
  one(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.one(id);
  }

  /** POST /users : création d'un utilisateur */
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  /** PATCH /users/:id : maj d'un utilisateur */
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  /** DELETE /users/:id : suppression d'un utilisateur */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
