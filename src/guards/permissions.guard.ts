import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../prisma.service';


@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private reflector: Reflector, private prisma: PrismaService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler());
        if (!requiredPermissions) return true; // Si no requiere permisos, permitir acceso

        const request = context.switchToHttp().getRequest();

        const user = request.user; // Obtenemos el usuario desde el token JWT

        const userWithRoles = await this.prisma.user.findUnique({
            where: { id: user.userId },
            include: {
                roles: {
                    include: {
                        role: {
                            include: {
                                RolePermission: {
                                    include: {
                                        permission: { include: { roles: true } },

                                    }
                                }
                            }
                        }
                    }
                }
            }

        });

        console.log(userWithRoles)

        // console.log(userWithRoles)

        // if (!userWithRoles) throw new ForbiddenException('Usuario no encontrado');

        // const userPermissions = userWithRoles.roles[0].role.permissions.map(p => p.permission.name)

        // const hasPermission = requiredPermissions.every(p => userPermissions.includes(p));

        // if (!hasPermission) throw new ForbiddenException('No tienes permisos para acceder a esta ruta');

        return true;
    }
}
