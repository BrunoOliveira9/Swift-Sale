import { IsInt, IsOptional, IsArray, ValidateNested, Min, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

class ItemVendaDto {
  @IsInt({ message: 'O ID do produto deve ser um número inteiro.' })
  produtoId: number;

  @IsInt({ message: 'A quantidade deve ser um número inteiro.' })
  @Min(1, { message: 'A quantidade mínima é 1.' })
  quantidade: number;
}

export class CreateVendaDto {
  @IsInt({ message: 'O ID do usuário deve ser um número inteiro.' })
  usuarioId: number;

  @IsOptional()
  @IsInt({ message: 'O ID do cliente deve ser um número inteiro.' })
  clienteId?: number;

  @IsArray({ message: 'Os itens devem estar em um array.' })
  @ValidateNested({ each: true })
  @Type(() => ItemVendaDto)
  itens: ItemVendaDto[];
}