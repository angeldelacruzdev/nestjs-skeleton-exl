import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class RegisterUserDto {
    @ApiProperty({ example: 'usuario@gmail.com', description: 'Correo electrónico del usuario' })
    @IsEmail({}, { message: 'El correo electrónico no es válido.' })
    email: string;

    @IsString()
    @ApiProperty({ example: 'Passw0rd!', description: 'Contraseña segura con al menos 8 caracteres' })
    password: string;
}
