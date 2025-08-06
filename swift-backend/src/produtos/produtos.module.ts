import { Module } from '@nestjs/common';
import { ProdutosController } from './controllers/produtos.controller';
import { ProdutosService } from './services/produtos.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthGuard } from '../auth/guard/authentication.guard';
import { AuthenticationModule } from 'src/auth/authtentication.modulo';

@Module({
  // imports: [AuthenticationModule],
  controllers: [ProdutosController],
  providers: [ProdutosService, PrismaService],
})
export class ProdutosModule {}
