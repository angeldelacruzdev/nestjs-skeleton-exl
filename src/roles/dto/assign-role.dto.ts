import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class AssignRoleDto {
    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID del usuario' })
    @IsUUID('4', { message: 'El ID del usuario debe ser un UUID válido' })
    userId: string;

    @ApiProperty({ example: 'admin', description: 'Nombre del rol a asignar' })
    @IsUUID('4', { message: 'El ID del role debe ser un UUID válido' })
    roleId: string;
}
