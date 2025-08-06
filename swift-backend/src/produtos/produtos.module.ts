import { Module } from '@nestjs/common';
import { ProdutosController } from './controllers/produtos.controller';
import { ProdutosService } from './services/produtos.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ProdutosController],
  providers: [ProdutosService, PrismaService]
})
export class ProdutosModule {}
