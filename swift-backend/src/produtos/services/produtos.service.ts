import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProdutoDto } from '../dto/create-produto.dto';
import { UpdateProdutoDto } from '../dto/update-produto.dto';

@Injectable()
export class ProdutosService {
  constructor(private prisma: PrismaService) {}

  async create(createProdutoDto: CreateProdutoDto) {
    const existingProduto = await this.prisma.cad_produto.findUnique({
      where: { codigo_barras: createProdutoDto.codigo_barras },
    });

    if (existingProduto) {
      throw new NotFoundException(`Produto com código de barras ${createProdutoDto.codigo_barras} já existe`);
    }
    return await this.prisma.cad_produto.create({
      data: createProdutoDto,
    });
  }

  async findAll() {
    return await this.prisma.cad_produto.findMany();
  }

  async findOne(id: number) {
    const produto = await this.prisma.cad_produto.findUnique({ where: { id } });
    if (!produto) throw new NotFoundException(`Produto com id ${id} não encontrado`);
    return produto;
  }

  async update(idProduct: number, data: UpdateProdutoDto) {
    await this.findOne(idProduct);

    const { id, ...dataSemId } = data;

    return this.prisma.cad_produto.update({
      where: { id : idProduct },
      data: dataSemId,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.cad_produto.delete({ where: { id } });
  }
}