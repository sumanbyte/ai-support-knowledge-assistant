import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { MinLength, MaxLength } from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(16)
    password?: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    googleId?: string;
}
