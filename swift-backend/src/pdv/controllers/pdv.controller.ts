import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { PdvService } from '../services/pdv.serice';
import { CreateVendaDto } from '../dto/create-venda.dto';

@Controller('pdv')
export class PdvController {
  constructor(private readonly pdvService: PdvService) {}

  @Post('venda')
  async criarVenda(@Body() dto: CreateVendaDto) {
    return await this.pdvService.criarVenda(dto);
  }

  @Delete('venda/:id')
  async deletarVenda(@Param('id') id: number) {
    return await this.pdvService.deletarVenda(id);
  }

  @Get('vendas')
  async listarVendas() {
    return await this.pdvService.listarVendas();
  }

  @Get('vendas/usuario/:id')
  async listarVendasPorUsuario(@Param('id') id: number) {
    return await this.pdvService.listarVendasPorUsuario(id);
  }
}