import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationService } from './auth/services/authentication.service';
import { Logger } from '@nestjs/common';
import { AuthenticationController } from './auth/controllers/authentication.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.TOKEN_JWT ?? (() => { throw new Error('Variável TOKEN_JWT não definida no .env'); })(),
      signOptions: {
        expiresIn: parseInt(process.env.EXPIRES || '1800')
      }
    })
  ],
  controllers: [AppController, AuthenticationController],
  providers: [AppService, AuthenticationService],
})
export class AppModule {}
