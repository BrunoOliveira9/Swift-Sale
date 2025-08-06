import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationController } from './controllers/authentication.controller';
import { AuthenticationService } from './services/authentication.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('TOKEN_JWT', 'valor_padrao'),
        signOptions: { expiresIn: '1h' },
      }),
    }),],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, PrismaService]
})
export class AuthenticationModule {}
