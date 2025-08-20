import { Module } from '@nestjs/common';
import { UsuariosController } from './controllers/usuarios.controller';
import { UsuariosService } from './services/usuarios.service';
import { PrismaService } from '../prisma/prisma.service';
import { HashService } from 'src/core/crypto/hash.service';
import { CryptoService } from 'src/core/crypto/crypto.service';
@Module({
  // imports: [AuthenticationModule],
  controllers: [UsuariosController],
  providers: [UsuariosService, PrismaService, HashService, CryptoService],
})
export class UsuariosModulo {}
