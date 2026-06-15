import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  birthdate?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ default: 'happy' })
  avatarId!: string;

  @Column({ nullable: true })
  lastBpm?: number;

  @Column({ default: 1 })
  streak!: number;

  @Column({ nullable: true })
  lastActiveDate?: string;
}
