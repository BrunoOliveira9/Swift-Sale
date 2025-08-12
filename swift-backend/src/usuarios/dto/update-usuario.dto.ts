import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuariosDto } from './create-usuario.dto';

export class UpdateUsuariosDto extends PartialType(CreateUsuariosDto) {}