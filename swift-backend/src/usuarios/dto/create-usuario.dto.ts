import { IsString, IsOptional, IsEmail, IsEnum, IsBoolean } from 'class-validator';
import { nivel_acesso } from '@prisma/client'

export class CreateUsuariosDto {
  @IsString()
  nome: string;

  @IsOptional()
  @IsString()
  sobrenome?: string;

  @IsString()
  username: string;
  
  @IsString()
  password: string;

  @IsOptional()
  @IsEmail({}, { message: 'E-mail inválido' })
  email?: string;

  @IsOptional()
  @IsString()
  telefone?: string;

  @IsString()
  cargo: string;

  @IsEnum(nivel_acesso, { message: 'Nível de acesso inválido' })
  nivel_acesso: nivel_acesso;

  @IsBoolean()
  ativo: boolean;
}