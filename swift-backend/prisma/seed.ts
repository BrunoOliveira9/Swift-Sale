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