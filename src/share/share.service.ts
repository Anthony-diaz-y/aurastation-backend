import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShareRelation } from './entities/share-relation.entity';
import { User } from '../users/entities/user.entity';
import { CalendarLog } from '../calendar/entities/calendar-log.entity';
import { CreateShareDto } from './dto/create-share.dto';
import { BrevoService } from '../providers/brevo/brevo.service';
import { MeasurementRow } from './template/measurement-row.template';
import { MeasurementTable } from './template/measurement-table.template';
import { MeasurementEmpty } from './template/measurement-empty.template';
import { buildNotesBlock } from './template/notes-block.template';
import { emailTemplate } from './template/email.template';

@Injectable()
export class ShareService {
  constructor(
    @InjectRepository(ShareRelation)
    private readonly shareRelationRepo: Repository<ShareRelation>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(CalendarLog)
    private readonly calendarLogRepo: Repository<CalendarLog>,

    private readonly brevoService: BrevoService,
  ) {}

  async createShare(
    senderId: number,
    dto: CreateShareDto,
  ): Promise<ShareRelation> {
    const sender = await this.userRepo.findOneBy({ id: senderId });
    const recipient = await this.userRepo.findOneBy({ id: dto.recipientId });

    if (!sender) {
      throw new NotFoundException('Usuario emisor no encontrado');
    }
    if (!recipient) {
      throw new NotFoundException('Usuario receptor no encontrado');
    }

    const relation = this.shareRelationRepo.create({
      senderId,
      recipientId: dto.recipientId,
      sharedDate: dto.sharedDate,
      logId: dto.logId,
    });
    const savedRelation = await this.shareRelationRepo.save(relation);

    const allDayLogs = await this.calendarLogRepo.find({
      where: { userId: senderId, date: dto.sharedDate },
      order: { registrationTime: 'ASC' },
    });

    const scopedLogs = dto.logId
      ? allDayLogs.filter((l) => l.id === dto.logId)
      : allDayLogs;

    const realMeasurements = scopedLogs.filter((l) => l.bpm != null);
    const notes = scopedLogs.map((l) => l.note?.trim()).filter(Boolean);
    const notesText =
      notes.length > 0 ? notes.join(' / ') : 'Sin notas registradas.';
    const formattedDate = new Date(
      dto.sharedDate + 'T00:00:00',
    ).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    let measurementsBlock = '';
    if (realMeasurements.length > 0) {
      const rows = realMeasurements
        .map((m, i) => MeasurementRow(m, i))
        .join('');

      measurementsBlock = MeasurementTable(rows);
    } else {
      measurementsBlock = MeasurementEmpty(notesText);
    }

    const notesBlock = notesText ? buildNotesBlock(notesText) : '';

    const emailSubject = `💓 ${sender.name || sender.email} compartió su ritmo cardíaco contigo — AuraStation`;
    const emailHtml = emailTemplate(
      formattedDate,
      recipient,
      sender,
      measurementsBlock,
      notesBlock,
    );

    void this.brevoService.sendEmail(
      recipient.email,
      recipient.name || recipient.email,
      emailSubject,
      emailHtml,
    );

    return savedRelation;
  }

  async getSharedByMe(senderId: number) {
    const relations = await this.shareRelationRepo.find({
      where: { senderId },
      order: { createdAt: 'DESC' },
    });

    const result: any[] = [];
    for (const rel of relations) {
      const recipient = await this.userRepo.findOneBy({ id: rel.recipientId });
      if (recipient) {
        let measurementInfo: any = null;
        if (rel.logId) {
          const mLog = await this.calendarLogRepo.findOneBy({ id: rel.logId });
          if (mLog) {
            measurementInfo = {
              bpm: mLog.bpm,
              registrationTime: mLog.registrationTime,
              stressLevel: mLog.stressLevel,
            };
          }
        }
        result.push({
          id: rel.id,
          sharedDate: rel.sharedDate,
          logId: rel.logId,
          measurementInfo,
          createdAt: rel.createdAt,
          user: {
            id: recipient.id,
            name: recipient.name || 'Usuario',
            email: recipient.email,
            avatarId: recipient.avatarId,
          },
        });
      }
    }
    return result;
  }

  async getSharedWithMe(recipientId: number) {
    const relations = await this.shareRelationRepo.find({
      where: { recipientId },
      order: { createdAt: 'DESC' },
    });

    const result: any[] = [];
    for (const rel of relations) {
      const sender = await this.userRepo.findOneBy({ id: rel.senderId });
      if (sender) {
        let measurementInfo: any = null;
        if (rel.logId) {
          const mLog = await this.calendarLogRepo.findOneBy({ id: rel.logId });
          if (mLog) {
            measurementInfo = {
              bpm: mLog.bpm,
              registrationTime: mLog.registrationTime,
              stressLevel: mLog.stressLevel,
            };
          }
        }
        result.push({
          id: rel.id,
          sharedDate: rel.sharedDate,
          logId: rel.logId,
          measurementInfo,
          createdAt: rel.createdAt,
          user: {
            id: sender.id,
            name: sender.name || 'Usuario',
            email: sender.email,
            avatarId: sender.avatarId,
          },
        });
      }
    }
    return result;
  }

  async deleteShare(id: number, currentUserId: number): Promise<void> {
    const relation = await this.shareRelationRepo.findOneBy({ id });
    if (!relation) {
      throw new NotFoundException('Relación de compartir no encontrada');
    }

    if (
      relation.senderId !== currentUserId &&
      relation.recipientId !== currentUserId
    ) {
      throw new ForbiddenException(
        'No tienes permiso para eliminar esta relación',
      );
    }

    await this.shareRelationRepo.remove(relation);
  }

  async getSharedLog(relationId: number, currentUserId: number) {
    const relation = await this.shareRelationRepo.findOneBy({ id: relationId });
    if (!relation) {
      throw new NotFoundException('Relación de compartir no encontrada');
    }

    if (
      relation.recipientId !== currentUserId &&
      relation.senderId !== currentUserId
    ) {
      throw new ForbiddenException('No tienes permiso para ver este reporte');
    }

    const allDayLogs = await this.calendarLogRepo.find({
      where: { userId: relation.senderId, date: relation.sharedDate },
      order: { registrationTime: 'ASC' },
    });

    const logs = relation.logId
      ? allDayLogs.filter((log) => log.id === relation.logId)
      : allDayLogs;

    return {
      sharedDate: relation.sharedDate,
      logs,
    };
  }
}
