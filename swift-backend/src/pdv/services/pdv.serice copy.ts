import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateVendaDto } from '../dto/create-venda.dto';

interface ItemVendaTemp {
  id_produto: number;
  quantidade: number;
  preco_unit: number;
  subtotal: number;
}

@Injectable()
export class PdvService {
  constructor(private readonly prisma: PrismaService) {}

  async criarVenda(dto: CreateVendaDto) {
    // Verifica se o usuário existe
    const usuario = await this.prisma.cad_usuario.findUnique({
      where: { id: dto.usuarioId },
    });
    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    // Verifica se cliente existe (se informado)
    if (dto.clienteId) {
      const cliente = await this.prisma.cliente.findUnique({
        where: { id: dto.clienteId },
      });
      if (!cliente) {
        throw new NotFoundException('Cliente não encontrado.');
      }
    }

    let totalVenda = 0;
    const itensVenda: ItemVendaTemp[] = [];

    // Valida produtos, calcula total e prepara dados
    for (const item of dto.itens) {
      const produto = await this.prisma.cad_produto.findUnique({
        where: { id: item.produtoId },
      });

      if (!produto) {
        throw new NotFoundException(`Produto ID ${item.produtoId} não encontrado.`);
      }

      if (produto.estoque_atual < item.quantidade) {
        throw new BadRequestException(
          `Estoque insuficiente para o produto ${produto.nome}.`
        );
      }

      const subtotal = Number(produto.preco_venda) * item.quantidade;
      totalVenda += subtotal;
      
      itensVenda.push({
        id_produto: item.produtoId,
        quantidade: item.quantidade,
        preco_unit: Number(produto.preco_venda),
        subtotal,
      });
    }

    // Transação para criar venda, itens e atualizar estoque
    const vendaCriada = await this.prisma.$transaction(async (tx) => {
      const novaVenda = await tx.venda.create({
        data: {
          id_usuario: dto.usuarioId,
          id_cliente: dto.clienteId || null,
          total: totalVenda,
        },
      });

      for (const item of itensVenda) {
        await tx.item_venda.create({
          data: {
            id_venda: novaVenda.id,
            id_produto: item.id_produto,
            quantidade: item.quantidade,
            preco_unit: item.preco_unit,
            subtotal: item.subtotal,
          },
        });

        // Atualiza estoque
        await tx.cad_produto.update({
          where: { id: item.id_produto },
          data: { estoque_atual: { decrement: item.quantidade } },
        });

        // Registra movimentação de estoque
        await tx.movimentacao_estoque.create({
          data: {
            id_produto: item.id_produto,
            tipo: 'SAIDA',
            quantidade: item.quantidade,
            observacao: `Venda #${novaVenda.id}`,
          },
        });
      }

      return novaVenda;
    });

    return { message: 'Venda criada com sucesso.', venda: vendaCriada };
  }

  async deletarVenda(id: number) {
    const venda = await this.prisma.venda.findUnique({ where: { id } });
    if (!venda) {
      throw new NotFoundException('Venda não encontrada.');
    }

    const itens = await this.prisma.item_venda.findMany({
      where: { id_venda: id },
    });

    await this.prisma.$transaction(async (tx) => {
      // Restaura estoque e registra entrada
      for (const item of itens) {
        await tx.cad_produto.update({
          where: { id: item.id_produto },
          data: { estoque_atual: { increment: item.quantidade } },
        });

        await tx.movimentacao_estoque.create({
          data: {
            id_produto: item.id_produto,
            tipo: 'ENTRADA',
            quantidade: item.quantidade,
            observacao: `Estorno da venda #${id}`,
          },
        });
      }

      await tx.item_venda.deleteMany({ where: { id_venda: id } });
      await tx.venda.delete({ where: { id } });
    });

    return { message: 'Venda deletada com sucesso.' };
  }

  async listarVendas() {
    return await this.prisma.venda.findMany({
      include: {
        usuario: true,
        cliente: true,
        itens: {
          include: { produto: true },
        },
      },
      orderBy: { id: 'desc' },
    });
  }

  async listarVendasPorUsuario(usuarioId: number) {
    return await this.prisma.venda.findMany({
      where: { id_usuario: usuarioId },
      include: {
        usuario: true,
        cliente: true,
        itens: {
          include: { produto: true },
        },
      },
      orderBy: { id: 'desc' },
    });
  }
}