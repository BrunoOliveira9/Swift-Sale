const { PrismaClient } = require('@prisma/client');
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto'

const prisma = new PrismaClient();

const saltRounds = 12; // Ideal para aplicações de produção

// Função para hash de senha
async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, saltRounds);
}

const key = Buffer.from(process.env.AES_KEY!, 'hex');
const iv = Buffer.from(process.env.AES_IV!, 'hex');
const algorithm = process.env.AES_ALGORITHM!;

function encrypt(text: string): string {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  return encrypted.toString('hex');
}

async function main() {
  await prisma.cad_produto.createMany({
    data: [
      { codigo_barras: '7891000000001', nome: 'Arroz Tipo 1', descricao: 'Arroz branco tipo 1', categoria: 'Grãos', unidade_medida: 'KG', preco_venda: 5.50, preco_custo: 3.00, estoque_atual: 200, estoque_minimo: 50 },
      { codigo_barras: '7891000000002', nome: 'Feijão Carioca', descricao: 'Feijão carioca tipo 1', categoria: 'Grãos', unidade_medida: 'KG', preco_venda: 7.00, preco_custo: 4.50, estoque_atual: 150, estoque_minimo: 40 },
      { codigo_barras: '7891000000003', nome: 'Café Torrado', descricao: 'Café torrado e moído', categoria: 'Bebidas', unidade_medida: 'KG', preco_venda: 20.00, preco_custo: 12.00, estoque_atual: 100, estoque_minimo: 30 },
      { codigo_barras: '7891000000004', nome: 'Óleo de Soja', descricao: 'Óleo de soja refinado', categoria: 'Óleos e Gorduras', unidade_medida: 'L', preco_venda: 6.00, preco_custo: 3.50, estoque_atual: 80, estoque_minimo: 20 },
      { codigo_barras: '7891000000005', nome: 'Açúcar Cristal', descricao: 'Açúcar cristal refinado', categoria: 'Doces', unidade_medida: 'KG', preco_venda: 4.50, preco_custo: 2.50, estoque_atual: 120, estoque_minimo: 30 },
      { codigo_barras: '7891000000006', nome: 'Sal Refinado', descricao: 'Sal refinado iodado', categoria: 'Temperos', unidade_medida: 'KG', preco_venda: 2.00, preco_custo: 1.00, estoque_atual: 150, estoque_minimo: 40 },
      { codigo_barras: '7891000000007', nome: 'Macarrão Espaguete', descricao: 'Macarrão tipo espaguete', categoria: 'Massas', unidade_medida: 'KG', preco_venda: 3.00, preco_custo: 1.80, estoque_atual: 200, estoque_minimo: 50 },
      { codigo_barras: '7891000000008', nome: 'Molho de Tomate', descricao: 'Molho de tomate pronto', categoria: 'Condimentos', unidade_medida: 'L', preco_venda: 5.00, preco_custo: 3.00, estoque_atual: 100, estoque_minimo: 30 },
      { codigo_barras: '7891000000009', nome: 'Farinha de Trigo', descricao: 'Farinha de trigo refinada', categoria: 'Farinha', unidade_medida: 'KG', preco_venda: 3.50, preco_custo: 2.00, estoque_atual: 150, estoque_minimo: 40 },
      { codigo_barras: '7891000000010', nome: 'Leite Longa Vida', descricao: 'Leite UHT', categoria: 'Laticínios', unidade_medida: 'L', preco_venda: 4.00, preco_custo: 2.50, estoque_atual: 120, estoque_minimo: 30 },
      { codigo_barras: '7891000000011', nome: 'Queijo Mussarela', descricao: 'Queijo mussarela fatiado', categoria: 'Laticínios', unidade_medida: 'KG', preco_venda: 25.00, preco_custo: 15.00, estoque_atual: 80, estoque_minimo: 20 },
      { codigo_barras: '7891000000012', nome: 'Presunto', descricao: 'Presunto fatiado', categoria: 'Carnes Frias', unidade_medida: 'KG', preco_venda: 20.00, preco_custo: 12.00, estoque_atual: 100, estoque_minimo: 30 },
      { codigo_barras: '7891000000013', nome: 'Salsicha', descricao: 'Salsicha tipo hot dog', categoria: 'Carnes', unidade_medida: 'KG', preco_venda: 8.00, preco_custo: 5.00, estoque_atual: 150, estoque_minimo: 40 },
      { codigo_barras: '7891000000014', nome: 'Presunto de Peru', descricao: 'Presunto de peru fatiado', categoria: 'Carnes Frias', unidade_medida: 'KG', preco_venda: 22.00, preco_custo: 13.00, estoque_atual: 90, estoque_minimo: 25 },
      { codigo_barras: '7891000000015', nome: 'Peito de Frango', descricao: 'Peito de frango congelado', categoria: 'Carnes', unidade_medida: 'KG', preco_venda: 15.00, preco_custo: 10.00, estoque_atual: 200, estoque_minimo: 50 },
      { codigo_barras: '7891000000016', nome: 'Linguiça Toscana', descricao: 'Linguiça toscana suína', categoria: 'Carnes', unidade_medida: 'KG', preco_venda: 18.00, preco_custo: 12.00, estoque_atual: 80, estoque_minimo: 20 },
      { codigo_barras: '7891000000017', nome: 'Bacon', descricao: 'Bacon defumado', categoria: 'Carnes', unidade_medida: 'KG', preco_venda: 25.00, preco_custo: 18.00, estoque_atual: 60, estoque_minimo: 15 },
      { codigo_barras: '7891000000018', nome: 'Peixe Congelado', descricao: 'Peixe congelado (ex: tilápia)', categoria: 'Peixes', unidade_medida: 'KG', preco_venda: 30.00, preco_custo: 20.00, estoque_atual: 70, estoque_minimo: 20 },
      { codigo_barras: '7891000000019', nome: 'Camarão Congelado', descricao: 'Camarão congelado', categoria: 'Frutos do Mar', unidade_medida: 'KG', preco_venda: 50.00, preco_custo: 35.00, estoque_atual: 50, estoque_minimo: 15 }
    ]
  });
  

    await prisma.cad_usuario.create({
      data: {
        nome: encrypt('Administrador'),
        username: encrypt('admin'),
        password: await hashPassword('admin123'),
        email: encrypt('admin@admin.com'),
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