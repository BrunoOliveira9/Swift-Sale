import { Module } from '@nestjs/common';
import { UsuariosController } from './controllers/usuarios.controller';
import { UsuariosService } from './services/usuarios.service';
import { PrismaService } from '../prisma/prisma.service';
import { HashService } from 'src/core/crypto/hash.service';
import { AuthGuard } from '../auth/guard/authentication.guard';
import { AuthenticationModule } from 'src/auth/authtentication.modulo';

@Module({
  // imports: [AuthenticationModule],
  controllers: [UsuariosController],
  providers: [UsuariosService, PrismaService, HashService],
})
export class UsuariosModulo {}
