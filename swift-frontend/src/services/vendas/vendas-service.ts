import { GenericCrudService } from '../crud/generic-crud.ts';
import { Venda, VendaResponse } from '../../models/venda';

export class VendasService extends GenericCrudService<Venda> {
  // Criar venda
  async criarVenda(data: Venda): Promise<{ message: string; venda: any }> {
    return this.create('/pdv/venda', data);
  }

  // Listar todas as vendas
  async listarVendas(): Promise<VendaResponse[]> {
    return this.list('/pdv/vendas');
  }

  // Listar vendas de um usuário
  async listarVendasPorUsuario(usuarioId: number): Promise<VendaResponse[]> {
    return this.list(`/pdv/vendas/usuario/${usuarioId}`);
  }

  // Deletar venda
  async deletarVenda(id: number): Promise<{ message: string }> {
    return this.delete('/pdv/venda', String(id));
  }
}