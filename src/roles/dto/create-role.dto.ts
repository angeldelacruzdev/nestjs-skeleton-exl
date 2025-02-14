import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, MinLength } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'admin', description: 'Nombre del rol' })
  @IsString()
  @Length(3, 20, { message: 'El nombre del rol debe tener entre 3 y 20 caracteres' })
  @MinLength(3, { message: 'El nombre del rol debe tener al menos 3 caracteres' })
  name: string;
}