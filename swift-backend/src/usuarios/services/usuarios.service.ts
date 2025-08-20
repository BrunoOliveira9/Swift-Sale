import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUsuariosDto } from '../dto/create-usuario.dto';
import { UpdateUsuariosDto } from '../dto/update-usuario.dto';
import { HashService } from '../../core/crypto/hash.service';
import { CryptoService } from 'src/core/crypto/crypto.service';

@Injectable()
export class UsuariosService {
  constructor(
    private prisma: PrismaService,
    private hash: HashService,
    private _cryptoService: CryptoService
  ) {}

  // essa função serve inteiramente pra descriptografar os dados de usuario para podermos enviar para o frontend dados legíveis
  private descriptografarUsuario(usuario: any) {
    const { password, username, nome, sobrenome, email, ...resto } = usuario;

    const decryptSafe = (value: string) => {
      if (!value) return null;
      try {
        return this._cryptoService.decrypt(value);
      } catch (err) {
        // se não conseguir descriptografar por inconsistência no AES KEY E AES IV, retorna o valor original criptografado
        return value;
      }
    };

    return {
      ...resto,
      username: decryptSafe(username),
      nome: decryptSafe(nome),
      sobrenome: sobrenome ? decryptSafe(sobrenome) : null,
      email: email ? decryptSafe(email) : null,
      password: 'Não autorizado',
    };
  }

  async create(createUsuarioDto: CreateUsuariosDto) {
    const hashedPassword = await this.hash.hashSenha(createUsuarioDto.password);

    const data = {
      ...createUsuarioDto,
      password: hashedPassword,
      username: this._cryptoService.encrypt(createUsuarioDto.username),
      nome: this._cryptoService.encrypt(createUsuarioDto.nome),
      sobrenome: createUsuarioDto.sobrenome? this._cryptoService.encrypt(createUsuarioDto.sobrenome) : null,
      email: createUsuarioDto.email? this._cryptoService.encrypt(createUsuarioDto.email) : null
    }

    try {
      const usuarioCriptografado = await this.prisma.cad_usuario.create({ data });
      const usuarioDescriptografado = this.descriptografarUsuario(usuarioCriptografado);
      return { ...usuarioDescriptografado, password: createUsuarioDto.password }
    } catch (error) {
      if (error.code === 'P2002') {
        const field = error.meta?.target?.[0];
        throw new ConflictException(`O campo '${field}' já está cadastrado.`);
      }
      throw error;
    }
  }

  async findAll() {
    const usuarios = await this.prisma.cad_usuario.findMany();
    return usuarios.map(usuario => this.descriptografarUsuario(usuario));
  }

  async findOne(id: number) {
    const usuario = await this.prisma.cad_usuario.findUnique({ where: { id } });
    if (!usuario) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }
    return this.descriptografarUsuario(usuario);
  }

  async update(id: number, updateUsuarioDto: UpdateUsuariosDto) {
    await this.findOne(id); // Garante que o usuário existe

    const dataToUpdate = { ...updateUsuarioDto };

    if (updateUsuarioDto.password) {
      dataToUpdate.password = await this.hash.hashSenha(updateUsuarioDto.password);
    } else {
      delete dataToUpdate.password;
    }

    // Criptografa campos se forem atualizados
    if (updateUsuarioDto.username) dataToUpdate.username = this._cryptoService.encrypt(updateUsuarioDto.username);
    if (updateUsuarioDto.nome) dataToUpdate.nome = this._cryptoService.encrypt(updateUsuarioDto.nome);
    if (updateUsuarioDto.sobrenome) dataToUpdate.sobrenome = this._cryptoService.encrypt(updateUsuarioDto.sobrenome);
    if (updateUsuarioDto.email) dataToUpdate.email = this._cryptoService.encrypt(updateUsuarioDto.email);

    try {
      const usuario = await this.prisma.cad_usuario.update({
        where: { id },
        data: dataToUpdate,
      });
      const usuarioDescriptografado = this.descriptografarUsuario(usuario);
      return { ...usuarioDescriptografado, password: updateUsuarioDto.password }
    } catch (error) {
      if (error.code === 'P2002') {
        const field = error.meta?.target?.[0];
        throw new ConflictException(`O campo '${field}' já está cadastrado.`);
      }
      throw error;
    }
  }
}