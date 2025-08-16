import { Module } from '@nestjs/common';
import { PdvController } from './controllers/pdv.controller';
import { PdvService } from './services/pdv.serice';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [PdvController],
  providers: [PdvService, PrismaService],
})
export class PdvModule {}