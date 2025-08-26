import { Module } from '@nestjs/common';
import { ClientesController } from './controllers/clientes.controller';
import { ClientesService } from './services/clientes.service';
import { PrismaService } from '../prisma/prisma.service';
import { HashService } from 'src/core/crypto/hash.service';
import { CryptoService } from 'src/core/crypto/crypto.service';
@Module({
  // imports: [AuthenticationModule],
  controllers: [ClientesController],
  providers: [ClientesService, PrismaService, HashService, CryptoService],
})
export class ClientesModulo {}
