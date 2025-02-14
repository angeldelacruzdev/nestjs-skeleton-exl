import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) { }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo rol' })
  @ApiResponse({ status: 201, description: 'Rol creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  createRole(@Body() body: CreateRoleDto) {
    return this.rolesService.createRole(body.name);
  }

  @Get()
  getRoles() {
    return this.rolesService.getRoles();
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
}
