import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { CalendarLog } from './entities/calendar-log.entity';
import { SaveCalendarLogDto } from './dto/save-calendar-log.dto';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(CalendarLog)
    private readonly calendarLogRepository: Repository<CalendarLog>,
  ) {}

  async findAll(userId: number): Promise<CalendarLog[]> {
    return this.calendarLogRepository.find({
      where: { userId },
      order: { date: 'ASC', registrationTime: 'ASC' },
    });
  }

  async save(userId: number, dto: SaveCalendarLogDto): Promise<CalendarLog> {
    if (dto.id) {
      const existing = await this.calendarLogRepository.findOneBy({
        id: dto.id,
        userId,
      });
      if (!existing) {
        throw new Error('Registro de calendario no encontrado');
      }
      if (dto.note !== undefined) existing.note = dto.note;
      if (dto.bpm !== undefined) existing.bpm = dto.bpm;
      if (dto.stressLevel !== undefined) existing.stressLevel = dto.stressLevel;
      if (dto.registrationTime !== undefined)
        existing.registrationTime = dto.registrationTime;

      return this.calendarLogRepository.save(existing);
    }

    if (dto.bpm !== undefined) {
      const newLog = this.calendarLogRepository.create({
        userId,
        ...dto,
      });
      return this.calendarLogRepository.save(newLog);
    }

    const existingNoteOnly = await this.calendarLogRepository.findOne({
      where: {
        userId,
        date: dto.date,
        bpm: IsNull(),
      },
    });

    if (existingNoteOnly) {
      if (dto.note !== undefined) existingNoteOnly.note = dto.note;
      return this.calendarLogRepository.save(existingNoteOnly);
    }

    const newLog = this.calendarLogRepository.create({
      userId,
      ...dto,
    });
    return this.calendarLogRepository.save(newLog);
  }
}
