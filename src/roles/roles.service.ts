import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class RolesService {
    constructor(private prisma: PrismaService) { }

    async createRole(name: string) {
        return this.prisma.role.create({ data: { name } });
    }

    async getRoles() {
        return this.prisma.role.findMany();
    }

    async deleteRole(id: string) {
        return this.prisma.role.delete({ where: { id } });
    }

    async assignRoleToUser(userId: string, roleId: string) {
        return this.prisma.userRole.create({ data: { userId, roleId } });
    }
}
