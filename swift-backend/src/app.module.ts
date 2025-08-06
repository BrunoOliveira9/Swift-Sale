import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProdutosModule } from './produtos/produtos.module';
import { AuthenticationModule } from './auth/authtentication.modulo';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/guard/authentication.guard';

@Module({
  imports: [PrismaModule, ProdutosModule, AuthenticationModule, ConfigModule.forRoot({
    isGlobal: true, // para estar disponível em todos os módulos
  })],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: AuthGuard,
  }],
})
export class AppModule {}
