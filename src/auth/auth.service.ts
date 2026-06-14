import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly UsersService: UsersService) {}

  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;

    const userExists = await this.UsersService.findByEmail(email);
    if (userExists) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const createdUser = await this.UsersService.create({
      email,
      password: hashedPassword,
    });

    return {
      messages: 'Usuario registrado exitosamente',
      user: {
        id: createdUser.id,
        email: createdUser.email,
      },
    };
  }
}
