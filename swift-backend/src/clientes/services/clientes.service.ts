import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateClientesDto } from '../dto/create-cliente.dto';
import { UpdateClientesDto } from '../dto/update-cliente.dto';
import { HashService } from '../../core/crypto/hash.service';
import { CryptoService } from 'src/core/crypto/crypto.service';

@Injectable()
export class ClientesService {
  constructor(
    private prisma: PrismaService,
    private hash: HashService,
    private _cryptoService: CryptoService
  ) {}

  // essa função serve inteiramente pra descriptografar os dados de clientes para podermos enviar para o frontend dados legíveis
  private descriptografarClientes(cliente: any) {
    const { nome, sobrenome, telefone, cpf, ...resto } = cliente;

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
      nome: decryptSafe(nome),
      sobrenome: sobrenome ? decryptSafe(sobrenome) : null,
      cpf: decryptSafe(cpf),
      telefone: telefone ? decryptSafe(telefone) : null
    };
  }

  async create(createClienteDto: CreateClientesDto) {

    const data = {
      ...createClienteDto,
      nome: this._cryptoService.encrypt(createClienteDto.nome),
      sobrenome: createClienteDto.sobrenome? this._cryptoService.encrypt(createClienteDto.sobrenome) : null,
      cpf: this._cryptoService.encrypt(createClienteDto.cpf),
      telefone : createClienteDto.telefone? this._cryptoService.encrypt(createClienteDto.telefone) : null
    }

    try {
      const clienteCriptografado = await this.prisma.cliente.create({ data });
      const clienteDescriptografado = this.descriptografarClientes(clienteCriptografado);
      return { ...clienteDescriptografado, cpf: createClienteDto.cpf }
    } catch (error) {
      if (error.code === 'P2002') {
        const field = error.meta?.target?.[0];
        throw new ConflictException(`O campo '${field}' já está cadastrado.`);
      }
      throw error;
    }
  }

  async findAll() {
    const clientes = await this.prisma.cliente.findMany();
    return clientes.map(cliente => this.descriptografarClientes(cliente));
  }

  async findOne(id: number) {
    const cliente = await this.prisma.cliente.findUnique({ where: { id } });
    if (!cliente) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }
    return this.descriptografarClientes(cliente);
  }

  async update(id: number, updateClienteDto: UpdateClientesDto) {
    await this.findOne(id); // Garante que o usuário existe

    const dataToUpdate = { ...updateClienteDto };

    if (updateClienteDto.cpf) {
      dataToUpdate.cpf = await this.hash.hashSenha(updateClienteDto.cpf);
    } else {
      delete dataToUpdate.cpf;
    }

    // Criptografa campos se forem atualizados
    if (updateClienteDto.nome) dataToUpdate.nome = this._cryptoService.encrypt(updateClienteDto.nome);
    if (updateClienteDto.sobrenome) dataToUpdate.sobrenome = this._cryptoService.encrypt(updateClienteDto.sobrenome);
    if (updateClienteDto.cpf) dataToUpdate.cpf = this._cryptoService.encrypt(updateClienteDto.cpf);
    if (updateClienteDto.telefone) dataToUpdate.telefone = this._cryptoService.encrypt(updateClienteDto.telefone);

    try {
      const cliente = await this.prisma.cliente.update({
        where: { id },
        data: dataToUpdate,
      });
      const clienteDescriptografado = this.descriptografarClientes(cliente);
      return { ...clienteDescriptografado, cpf: updateClienteDto.cpf }
    } catch (error) {
      if (error.code === 'P2002') {
        const field = error.meta?.target?.[0];
        throw new ConflictException(`O campo '${field}' já está cadastrado.`);
      }
      throw error;
    }
  }
}