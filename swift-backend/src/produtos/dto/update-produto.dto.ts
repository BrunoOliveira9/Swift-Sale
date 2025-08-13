import { PartialType } from '@nestjs/mapped-types';
import { CreateProdutoDto } from './create-produto.dto';
import { IsInt, Min } from 'class-validator';

export class UpdateProdutoDto extends PartialType(CreateProdutoDto) {
  @IsInt()
  @Min(1)
  id: number;
}