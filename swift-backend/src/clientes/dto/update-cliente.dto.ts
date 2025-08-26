import { PartialType } from '@nestjs/mapped-types';
import { CreateClientesDto } from './create-cliente.dto';

export class UpdateClientesDto extends PartialType(CreateClientesDto) {}