import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUsuariosDto } from '../dto/create-usuario.dto';
import { UpdateUsuariosDto } from '../dto/update-usuario.dto';
import { HashService } from '../../core/crypto/hash.service';

@Injectable()
export class UsuariosService {
  constructor(
    private prisma: PrismaService,
    private hash: HashService
  ) {}

  async create(createUsuarioDto: CreateUsuariosDto) {
    const hashedPassword = await this.hash.hashSenha(createUsuarioDto.password);

    try {
      return await this.prisma.cad_usuario.create({
        data: {
          ...createUsuarioDto,
          password: hashedPassword,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        const field = error.meta?.target?.[0];
        throw new ConflictException(`O campo '${field}' já está cadastrado.`);
      }
      throw error;
    }
  }

  async findAll() {
    return await this.prisma.cad_usuario.findMany();
  }

  async findOne(id: number) {
    const usuario = await this.prisma.cad_usuario.findUnique({ where: { id } });
    if (!usuario) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }
    return usuario;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuariosDto) {
    await this.findOne(id); // Garante que existe
    try {
      return await this.prisma.cad_usuario.update({
        where: { id },
        data: updateUsuarioDto,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        const field = error.meta?.target?.[0];
        throw new ConflictException(`O campo '${field}' já está cadastrado.`);
      }
      throw error;
    }
  }
}