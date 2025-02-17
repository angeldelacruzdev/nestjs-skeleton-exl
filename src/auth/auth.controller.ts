import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { Public } from '../decorators/public.decorator';
import { RegisterUserDto } from './dto/register-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';
import { GetUserId } from 'src/decorators/get-user-id.decorator';
import { RtGuard } from '../guards/rt-guards';
import { GetRefreshToken } from '../decorators/get-refresh-token.decorator';

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

    @ApiOperation({ summary: 'Refrescar token' })
    @Post('refresh')
    @UseGuards(RtGuard)
    async refresh(@GetRefreshToken() token: string, @GetUserId() userId: string,) {
        const response = this.authService.refreshAccessToken(token, userId)
        console.log(response)
        return await this.authService.refreshAccessToken(token, userId);
    }

    @ApiOperation({ summary: 'Cerrar sesión' })
    @Post('logout')
    async logout(@Body() { refreshToken }: { refreshToken: string }) {
        await this.authService.revokeRefreshToken(refreshToken);
        return { message: 'Sesión cerrada' };
    }

    @ApiOperation({ summary: 'Obtener mi información' })
    @Get('me')
    async me(@GetUserId() userId: string) {
        return this.authService.getUserRolesAndPermissions(userId);
    }

}
