import {
  Controller,
  Patch,
  UseGuards,
  Req,
  Body,
  Get,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import type { Request } from 'express';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get('search')
  async searchUsers(@Query('q') query: string, @Req() req: Request) {
    const payload = req['user'] as { sub: number; email: string };
    const results = await this.usersService.search(query || '', payload.sub);
    return results.map((u) => {
      const sanitized = { ...u };
      delete sanitized.password;
      return sanitized;
    });
  }

  @UseGuards(AuthGuard)
  @Patch('me')
  async updateProfile(@Req() req: Request, @Body() updateData: Partial<User>) {
    const payload = req['user'] as { sub: number; email: string };
    const updatedUser = await this.usersService.update(payload.sub, updateData);
    const result = { ...updatedUser };
    delete result.password;
    return result;
  }
}
