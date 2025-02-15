import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { PermissionsGuard } from '../guards/permissions.guard';
import { Permissions } from '../decorators/permissions.decorator';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';

@ApiTags('Permisos') // 📌 Categoría en Swagger
@Controller('permissions')
@UseGuards(PermissionsGuard)
export class PermissionController {
    constructor(private readonly permissionService: PermissionService) { }

    @Post()
    @Permissions('create-permission') // Protegemos la ruta con permisos
    @ApiOperation({ summary: 'Crear un nuevo permiso' })
    @ApiResponse({ status: 201, description: 'Permiso creado exitosamente' })
    @ApiResponse({ status: 403, description: 'No autorizado' })
    create(@Body() createPermissionDto: CreatePermissionDto) {
        return this.permissionService.createPermission(createPermissionDto);
    }

    @Get()
    @Permissions('view-permissions')
    @ApiOperation({ summary: 'Obtener todos los permisos' })
    @ApiResponse({ status: 200, description: 'Lista de permisos' })
    findAll() {
        return this.permissionService.getAllPermissions();
    }
}
