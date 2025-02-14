import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AccountLockGuard implements CanActivate {
    constructor(private prisma: PrismaService) { }

    //Bloquear acceso a usuarios bloqueados antes de que lleguen al servicio.
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) return false;

        const foundUser = await this.prisma.user.findUnique({ where: { id: user.id } });

        if (foundUser?.lockedUntil && new Date() < foundUser.lockedUntil) {
            throw new ForbiddenException('Tu cuenta está bloqueada. Inténtalo más tarde.');
        }

        return true;
    }
}