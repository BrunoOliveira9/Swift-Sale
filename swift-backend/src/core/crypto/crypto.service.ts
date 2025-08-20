import * as crypto from 'crypto';

export class CryptoService {
  private readonly key = Buffer.from(process.env.AES_KEY!, 'hex'); // 16 bytes
  private readonly iv = Buffer.from(process.env.AES_IV!, 'hex');   // 16 bytes
  private readonly algorithm = process.env.AES_ALGORITHM!;

  encrypt(text: string): string {
    const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    return encrypted.toString('hex');
  }

  decrypt(encrypted: string): string {
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
    const decrypted = Buffer.concat([decipher.update(Buffer.from(encrypted, 'hex')), decipher.final()]);
    return decrypted.toString('utf8');
  }
}
