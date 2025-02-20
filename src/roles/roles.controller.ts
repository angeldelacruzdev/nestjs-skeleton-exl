import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { AssignPermissionDto } from './dto/assign-permission.dto';
import { Permissions } from '../decorators/permissions.decorator';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RemovePermissionDto } from './dto/remove-permission.dto';

@Controller('roles')
@UseGuards(PermissionsGuard)
export class RolesController {
  constructor(private rolesService: RolesService) { }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo rol' })
  @ApiResponse({ status: 201, description: 'Rol creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async createRole(@Body() body: CreateRoleDto) {
    return this.rolesService.createRole(body.name);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener los roles' })
  getRoles() {
    return this.rolesService.getRoles();
  }

  @Delete('remove-permission')
  @Permissions('remove-permission') // Protección con permisos
  @ApiOperation({ summary: 'Eliminar un permiso de un rol' })
  @ApiResponse({ status: 200, description: 'Permiso eliminado correctamente' })
  @ApiResponse({ status: 404, description: 'Rol o permiso no encontrado' })
  @ApiResponse({ status: 409, description: 'El permiso no está asignado al rol' })
  async removePermission(@Body() dto: RemovePermissionDto) {

    return this.rolesService.removePermissionFromRole(dto);
  }

  @Delete(':id')
  deleteRole(@Param('id') id: string) {
    return this.rolesService.deleteRole(id);
  }

  @Post('assign')
  @ApiOperation({ summary: 'Asignar un rol a un usuario' })
  @ApiResponse({ status: 200, description: 'Rol asignado correctamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  assignRole(@Body() body: AssignRoleDto) {
    return this.rolesService.assignRoleToUser(body.userId, body.roleId);
  }

  @Post('assign-permission')
  @Permissions('assign-permission') // Protección con permisos
  @ApiOperation({ summary: 'Asignar un permiso a un rol' })
  @ApiResponse({ status: 201, description: 'Permiso asignado correctamente' })
  @ApiResponse({ status: 404, description: 'Rol o permiso no encontrado' })
  @ApiResponse({ status: 409, description: 'El permiso ya está asignado' })
  async assignPermission(@Body() dto: AssignPermissionDto) {
    return this.rolesService.assignPermissionToRole(dto);
  }

}
