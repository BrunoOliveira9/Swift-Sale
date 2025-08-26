import { Controller, Get, Post, Body, Param, Delete, Patch, ParseIntPipe, UseGuards, Put } from '@nestjs/common';
import { ClientesService } from '../services/clientes.service';
import { CreateClientesDto } from '../dto/create-cliente.dto';
import { UpdateClientesDto } from '../dto/update-cliente.dto';
import { AuthGuard } from '../../auth/guard/authentication.guard';

@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  create(@Body() createClienteDto: CreateClientesDto) {
    return this.clientesService.create(createClienteDto);
  }

  @Get()
  findAll() {1
    return this.clientesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.clientesService.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() UpdateClienteDto: UpdateClientesDto) {
    return this.clientesService.update(id, UpdateClienteDto);
  }
}