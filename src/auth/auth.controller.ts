import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { Public } from '../decorators/public.decorator';
import { RegisterUserDto } from './dto/register-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Public()
    @Post('login')
    @ApiOperation({ summary: 'Iniciar sesión' })
    @ApiResponse({ status: 200, description: 'Inicio de sesión exitoso' })
    @ApiResponse({ status: 400, description: 'Credenciales inválidas' })
    async login(@Body() { email, password }: LoginUserDto, @Req() req: Request) {

        const ipAddress = req.ip;
        const userAgent: string = req.headers['user-agent'] || "0";

        return this.authService.login(email, password, ipAddress, userAgent);
    }

    @Public()
    @Post('register')
    @ApiOperation({ summary: 'Registrar un nuevo usuario' })
    @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente' })
    @ApiResponse({ status: 400, description: 'Datos inválidos' })
    async register(@Body() { email, password }: RegisterUserDto, @Req() req: Request) {
        return this.authService.register(email, password);
    }

    @Post('refresh')
    async refresh(@Body() { refreshToken }: { refreshToken: string }) {

        return this.authService.refreshAccessToken(refreshToken);
    }

    @Post('logout')
    async logout(@Body() { refreshToken }: { refreshToken: string }) {
        await this.authService.revokeRefreshToken(refreshToken);
        return { message: 'Sesión cerrada' };
    }

}
