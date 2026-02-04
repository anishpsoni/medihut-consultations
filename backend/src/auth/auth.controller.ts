import { Controller, Post, Body, Get, Headers, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto, SignInDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('signin')
  async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('signout')
  async signOut(@Headers('authorization') authorization: string) {
    const token = authorization?.replace('Bearer ', '');
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    return this.authService.signOut(token);
  }

  @Get('me')
  async getCurrentUser(@Headers('authorization') authorization: string) {
    const token = authorization?.replace('Bearer ', '');
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    return this.authService.getCurrentUser(token);
  }
}
