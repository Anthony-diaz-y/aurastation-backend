import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('calendar_logs')
export class CalendarLog {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @Column()
  date!: string;

  @Column({ nullable: true })
  bpm?: number;

  @Column({ nullable: true })
  stressLevel?: string;

  @Column({ nullable: true })
  registrationTime?: string;

  @Column({ nullable: true, type: 'text' })
  note?: string;
}
