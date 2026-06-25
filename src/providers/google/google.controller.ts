import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GoogleService } from './google.service';
import { IGoogleUser } from './interfaces/google.interface';
import type { Request, Response } from 'express';

@Controller('auth/google')
export class GoogleController {
  constructor(private readonly googleService: GoogleService) {}

  @Get()
  @UseGuards(AuthGuard('google'))
  googleAuth() {}

  @Get('callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    const googleUser = req.user as IGoogleUser;
    const { accessToken, user } =
      await this.googleService.loginWithGoogle(googleUser);

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    return res.redirect(
      `${frontendUrl}/auth/google/callback?token=${accessToken}&user=${encodeURIComponent(JSON.stringify(user))}`,
    );
  }
}
