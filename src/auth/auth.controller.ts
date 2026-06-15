import { Body, Controller, Post, Get, UseGuards, Req } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
  ) {
    const { accessToken, user } = await this.authService.login(loginDto);

    return {
      message: 'Inicio de sesión exitoso',
      user,
      accessToken,
    };
  }

  @Post('logout')
  async logout() {
    return {
      message: 'Sesión cerrada exitosamente',
    };
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async getMe(@Req() req: Request) {
    const payload = req['user'] as { sub: number; email: string };
    return this.authService.getProfile(payload.sub);
  }
}
