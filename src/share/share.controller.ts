import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { ShareService } from './share.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CreateShareDto } from './dto/create-share.dto';
import type { Request } from 'express';

@Controller('share')
@UseGuards(AuthGuard)
export class ShareController {
  constructor(private readonly shareService: ShareService) {}

  @Post()
  async shareData(@Req() req: Request, @Body() dto: CreateShareDto) {
    const payload = req['user'] as { sub: number };
    return this.shareService.createShare(payload.sub, dto);
  }

  @Get('shared-by-me')
  async getSharedByMe(@Req() req: Request) {
    const payload = req['user'] as { sub: number };
    return this.shareService.getSharedByMe(payload.sub);
  }

  @Get('shared-with-me')
  async getSharedWithMe(@Req() req: Request) {
    const payload = req['user'] as { sub: number };
    return this.shareService.getSharedWithMe(payload.sub);
  }

  @Delete(':id')
  async deleteShare(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const payload = req['user'] as { sub: number };
    await this.shareService.deleteShare(id, payload.sub);
    return { success: true };
  }

  @Get('shared-log/:id')
  async getSharedLog(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const payload = req['user'] as { sub: number };
    return this.shareService.getSharedLog(id, payload.sub);
  }
}
