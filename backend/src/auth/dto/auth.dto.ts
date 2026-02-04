import { IsEmail, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '../auth.service';

export class SignUpDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  fullName: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}

export class SignInDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
