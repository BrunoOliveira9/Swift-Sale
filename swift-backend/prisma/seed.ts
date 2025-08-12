const { PrismaClient } = require('@prisma/client');
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const saltRounds = 12; // Ideal para aplicações de produção

// Função para hash de senha
async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, saltRounds);
}

async function main() {
  await prisma.cad_produto.createMany({
    data: [
      {
        codigo_barras: '1234567890123',
        nome: 'Produto Teste 1',
        descricao: 'Descrição do produto teste 1',
        categoria: 'Categoria A',
        unidade_medida: 'UNIDADE',
        preco_venda: 10.0,
        preco_custo: 5.0,
        estoque_atual: 100,
        estoque_minimo: 10,
      },
      {
        codigo_barras: '9876543210987',
        nome: 'Produto Teste 2',
        descricao: 'Descrição do produto teste 2',
        categoria: 'Categoria B',
        unidade_medida: 'KG',
        preco_venda: 20.0,
        preco_custo: 15.0,
        estoque_atual: 50,
        estoque_minimo: 5,
      },
    ],
  });

    await prisma.cad_usuario.create({
      data: {
        nome: 'Administrador',
        username: 'admin',
        password: await hashPassword('admin123'),
        email:'admin@admin.com',
        cargo: 'Administrador',
        nivel_acesso: 'ADMIN',
        ativo: true
      },
    });

  console.log('Dados de teste inseridos com sucesso!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });