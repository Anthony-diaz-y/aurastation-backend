import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ShareService } from './share.service';
import { ShareController } from './share.controller';
import { ShareRelation } from './entities/share-relation.entity';
import { User } from '../users/entities/user.entity';
import { CalendarLog } from '../calendar/entities/calendar-log.entity';
import { BrevoModule } from '../providers/brevo/brevo.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShareRelation, User, CalendarLog]),
    BrevoModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  controllers: [ShareController],
  providers: [ShareService],
})
export class ShareModule {}
