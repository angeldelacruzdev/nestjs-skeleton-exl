import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: '15m' },
    }),

  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, ActivityLogService, NotificationsGateway],
  exports: [JwtModule]
})
export class AuthModule { }
