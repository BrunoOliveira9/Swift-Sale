import { IsString, IsOptional, IsNotEmpty, Length } from 'class-validator';

export class CreateClientesDto {
  @IsNotEmpty({ message: 'O nome é obrigatórrio'})
  @IsString({ message: 'O nome deve ser um texto'})
  nome: string;

  @IsOptional()
  @IsString({ message: 'O sobrenome deve ser um texto'})
  sobrenome?: string;

  @IsNotEmpty({ message: 'O CPF é obrigatórrio'})
  @IsString({ message: 'O CPF deve ser um texto'})
  cpf: string;

  @IsOptional()
  @IsString()
  telefone?: string;

}