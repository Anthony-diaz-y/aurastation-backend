import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('share_relations')
export class ShareRelation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  senderId!: number;

  @Column()
  recipientId!: number;

  @Column()
  sharedDate!: string;

  @Column({ type: 'int', nullable: true })
  logId?: number;

  @CreateDateColumn()
  createdAt!: Date;
}
