import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreatePermissionDto } from './dto/create-permission.dto';

@Injectable()
export class PermissionService {
    constructor(private prisma: PrismaService) { }

    async createPermission(dto: CreatePermissionDto) {
        return this.prisma.permission.create({ data: { name: dto.name } });
    }

    async getAllPermissions() {
        return this.prisma.permission.findMany();
    }

    
}
