import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from '../auth/dto/register.dto';
import * as bcrypt from 'bcrypt';
import { IGoogleUser } from '../providers/google/interfaces/google.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  async create(registerDto: RegisterDto): Promise<User> {
    const user = this.userRepository.create(registerDto);
    return this.userRepository.save(user);
  }

  async update(id: number, updateData: Partial<User>): Promise<User> {
    const dataToUpdate = { ...updateData };
    if (dataToUpdate.password && dataToUpdate.password !== '••••••••') {
      const saltRounds = 10;
      dataToUpdate.password = await bcrypt.hash(
        dataToUpdate.password,
        saltRounds,
      );
    } else {
      delete dataToUpdate.password;
    }
    await this.userRepository.update(id, dataToUpdate);
    const updatedUser = await this.findById(id);
    if (!updatedUser) {
      throw new Error('Usuario no encontrado');
    }
    return updatedUser;
  }

  async findOrCreateGoogleUser(googleUser: IGoogleUser): Promise<User> {
    let user = await this.userRepository.findOneBy({
      googleId: googleUser.googleId,
    });
    if (user) return user;

    user = await this.userRepository.findOneBy({ email: googleUser.email });
    if (user) {
      user.googleId = googleUser.googleId;
      user.provider = 'google';
      return this.userRepository.save(user);
    }

    const newUser = this.userRepository.create({
      email: googleUser.email,
      name: `${googleUser.firstName} ${googleUser.lastName}`.trim(),
      googleId: googleUser.googleId,
      provider: 'google',
      avatarId: 'happy',
      streak: 1,
    });
    return this.userRepository.save(newUser);
  }
}
