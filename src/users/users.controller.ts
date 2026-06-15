import { Controller, Patch, UseGuards, Req, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import type { Request } from 'express';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Patch('me')
  async updateProfile(
    @Req() req: Request,
    @Body() updateData: Partial<User>,
  ) {
    const payload = req['user'] as { sub: number; email: string };
    const updatedUser = await this.usersService.update(payload.sub, updateData);
    const { password, ...result } = updatedUser;
    return result;
  }
}
