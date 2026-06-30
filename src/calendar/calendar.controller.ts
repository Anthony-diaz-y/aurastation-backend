import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CalendarService } from './calendar.service';
import { SaveCalendarLogDto } from './dto/save-calendar-log.dto';
import type { Request } from 'express';

@Controller('calendar')
@UseGuards(AuthGuard)
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get()
  async getLogs(@Req() req: Request) {
    const payload = req['user'] as { sub: number; email: string };
    return this.calendarService.findAll(payload.sub);
  }

  @Get('days-with-measurements')
  async getDaysWithMeasurements(@Req() req: Request) {
    const payload = req['user'] as { sub: number; email: string };
    return this.calendarService.getDaysWithMeasurements(payload.sub);
  }

  @Post()
  async saveLog(@Req() req: Request, @Body() dto: SaveCalendarLogDto) {
    const payload = req['user'] as { sub: number; email: string };
    return this.calendarService.save(payload.sub, dto);
  }
}
