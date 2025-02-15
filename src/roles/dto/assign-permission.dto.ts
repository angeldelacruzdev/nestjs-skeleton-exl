import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class AssignPermissionDto {
    @ApiProperty({ example: '408529e6-cc1f-4a1c-a1e2-db5c00fb2778', description: 'ID del Rol' })
    @IsUUID()
    roleId: string;

    @ApiProperty({ example: 'b5a2f1c3-8e39-4a23-98c6-4d9f7f5c4a27', description: 'ID del Permiso' })
    @IsUUID()
    permissionId: string;
}
