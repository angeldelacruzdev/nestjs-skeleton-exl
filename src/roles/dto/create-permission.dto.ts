import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePermissionDto {
    @ApiProperty({ example: 'create-user', description: 'Nombre del permiso' })
    @IsString()
    name: string;
}
