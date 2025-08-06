import { IsString, IsOptional, IsEnum, IsNumber, Min, IsInt } from 'class-validator';
import { unidade_medida } from '@prisma/client';

export class CreateProdutoDto {
  @IsString()
  codigo_barras: string;

  @IsString()
  nome: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsString()
  categoria: string;

  @IsOptional()
  @IsEnum(unidade_medida)
  unidade_medida: unidade_medida;

  @IsNumber()
  @Min(0)
  preco_venda: number;

  @IsNumber()
  @Min(0)
  preco_custo: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  estoque_atual?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  estoque_minimo?: number;
}