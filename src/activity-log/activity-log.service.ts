import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class ActivityLogService {
    constructor(private prisma: PrismaService, private notificationsGateway: NotificationsGateway) { }

    async createLog(userId: string, action: string, ipAddress?: string, userAgent?: string) {
        await this.prisma.activityLog.create({
            data: { userId, action, ipAddress, userAgent },
        });

        await this.checkSuspiciousActivity(userId, action, ipAddress);
    }

    private async checkSuspiciousActivity(userId: string, action: string, ipAddress?: string) {
        try {
            const lastLogins = await this.prisma.activityLog.findMany({
                where: { userId, action: 'LOGIN' },
                orderBy: { createdAt: 'desc' },
                take: 5,
            });

            // 🚨 Si la IP actual es diferente a la última, enviamos alerta
            if (lastLogins.length > 1 && lastLogins[0].ipAddress !== ipAddress) {
                this.notificationsGateway.sendAlert(userId, '⚠ Se detectó un inicio de sesión desde una IP desconocida.');
            }

            // 🚨 Si hay más de 5 intentos de inicio de sesión en 10 minutos, enviamos alerta
            const failedAttempts = await this.prisma.activityLog.count({
                where: {
                    userId,
                    action: 'FAILED_LOGIN',
                    createdAt: { gte: new Date(Date.now() - 10 * 60 * 1000) }, // Últimos 10 min
                },
            });

            if (failedAttempts >= 5) {
                this.notificationsGateway.sendAlert(userId, '⚠ Se detectaron múltiples intentos de acceso fallidos.');
            }
        } catch (error) {
            console.log(error)
        }
    }
}
