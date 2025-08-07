import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  private readonly SALT_OR_ROUNDS = 12;

  async hashSenha(senha: string): Promise<string> {
    return bcrypt.hash(senha, this.SALT_OR_ROUNDS);
  }

  async compararSenha(senha: string, hash: string): Promise<boolean> {
    // console.log('Comparando senha:', senha, 'com hash:', hash);
    return bcrypt.compare(senha, hash);
  }
}