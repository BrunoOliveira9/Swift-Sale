export type ItemVenda = {
  produtoId: number;
  quantidade: number;
};

export type Venda = {
  id?: number;
  usuarioId: number;
  clienteId?: number;
  itens: ItemVenda[];
  total?: number;
  createdAt?: string;
};

export type VendaResponse = {
  id: number;
  total: number;
  created_at: string;
  usuario: {
    nome: string;
  };
  cliente?: {
    nome: string;
    cpf: string;
  };
  itens: {
    quantidade: number;
    produto: {
      nome: string;
    };
  }[];
};