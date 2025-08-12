import { Controller, Get, Post, Body, Param, Delete, Patch, ParseIntPipe, UseGuards } from '@nestjs/common';
import { UsuariosService } from '../services/usuarios.service';
import { CreateUsuariosDto } from '../dto/create-usuario.dto';
import { UpdateUsuariosDto } from '../dto/update-usuario.dto';
import { AuthGuard } from '../../auth/guard/authentication.guard';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  create(@Body() createProdutoDto: CreateUsuariosDto) {
    return this.usuariosService.create(createProdutoDto);
  }

  @Get()
  findAll() {1
    return this.usuariosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProdutoDto: UpdateUsuariosDto) {
    return this.usuariosService.update(id, updateProdutoDto);
  }
}