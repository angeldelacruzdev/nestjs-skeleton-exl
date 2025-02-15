import { ConflictException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AssignPermissionDto } from './dto/assign-permission.dto';
import { RemovePermissionDto } from './dto/remove-permission.dto';

@Injectable()
export class RolesService {
    constructor(private prisma: PrismaService) { }

    async createRole(name: string) {
        const saved = await this.prisma.role.create({ data: { name } });
        return saved;
    }

    async getRoles() {
        return this.prisma.role.findMany();
    }

    async deleteRole(id: string) {

        return;
        return this.prisma.role.delete({ where: { id } });
    }

    async assignRoleToUser(userId: string, roleId: string) {
        return this.prisma.userRole.create({ data: { userId, roleId } });
    }

    async assignPermissionToRole(dto: AssignPermissionDto) {
        const { roleId, permissionId } = dto;

        // Verificar si el rol existe
        const role = await this.prisma.role.findUnique({ where: { id: roleId } });
        if (!role) throw new NotFoundException('El rol no existe.');

        // Verificar si el permiso existe
        const permission = await this.prisma.permission.findUnique({ where: { id: permissionId } });
        if (!permission) throw new NotFoundException('El permiso no existe.');

        // Verificar si la relación ya existe
        const existingRelation = await this.prisma.rolePermission.findFirst({
            where: { roleId, permissionId },
        });

        if (existingRelation) throw new ConflictException('El permiso ya está asignado al rol.');

        // Asignar el permiso al rol
        return this.prisma.rolePermission.create({ data: { roleId, permissionId } });
    }

    async removePermissionFromRole(dto: RemovePermissionDto) {
        const { roleId, permissionId } = dto;

        // Verificar si el rol existe
        const role = await this.prisma.role.findUnique({ where: { id: roleId } });

        console.log(role)

        if (!role) throw new NotFoundException('El rol no existe.');

        // Verificar si el permiso existe
        const permission = await this.prisma.permission.findUnique({ where: { id: permissionId } });
        if (!permission) throw new NotFoundException('El permiso no existe.');

        // Verificar si la relación existe
        const existingRelation = await this.prisma.rolePermission.findUnique({
            where: { roleId_permissionId: { roleId, permissionId } },
        });

        if (!existingRelation) throw new ConflictException('El permiso no está asignado al rol.');

        // Eliminar la relación
        return this.prisma.rolePermission.delete({
            where: { roleId_permissionId: { roleId, permissionId } },
        });
    }
}
