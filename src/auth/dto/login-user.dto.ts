import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class LoginUserDto {
    @ApiProperty({ example: 'usuario@gmail.com', description: 'Correo electrónico del usuario' })
    @Transform(({ value }) => value.toLowerCase().trim())
    @IsEmail({}, { message: 'El correo electrónico no es válido.' })
    email: string;

    @ApiProperty({ example: 'Passw0rd!', description: 'Contraseña del usuario' })
    @IsString()
    password: string;
}
