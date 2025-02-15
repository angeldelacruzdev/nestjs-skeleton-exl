import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { PrismaService } from '../prisma.service';


@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector, private prisma: PrismaService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());


        console.log(requiredRoles)

        if (!requiredRoles) return true;

        const request = context.switchToHttp().getRequest();
        const user = request.user;

      

        if (!user) return false;

        const userRoles = await this.prisma.userRole.findMany({
            where: { userId: user.id },
            include: { role: true },
        });

        const userRoleNames = userRoles.map(r => r.role.name);

        const hasRole = requiredRoles.some(role => userRoleNames.includes(role));

        if (!hasRole) {
            throw new ForbiddenException('No tienes permisos para acceder a esta ruta.');
        }

        return true;
    }
}
