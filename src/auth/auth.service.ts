import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly UsersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;

    const userExists = await this.UsersService.findByEmail(email);
    if (userExists) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const createdUser = await this.UsersService.create({
      ...registerDto,
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

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.UsersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    if (!user.password) {
      throw new UnauthorizedException(
        'Esta cuenta usa inicio de sesión con Google',
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      message: 'Inicio de sesión exitoso',
      user: {
        id: user.id,
        email: user.email,
      },
      accessToken,
    };
  }

  async getProfile(userId: number) {
    let user = await this.UsersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const today = new Date();
    const todayStr = today.toLocaleDateString('en-CA');

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toLocaleDateString('en-CA');

    let updated = false;
    if (!user.lastActiveDate) {
      user.streak = 1;
      user.lastActiveDate = todayStr;
      updated = true;
    } else if (user.lastActiveDate === yesterdayStr) {
      user.streak = (user.streak || 0) + 1;
      user.lastActiveDate = todayStr;
      updated = true;
    } else if (user.lastActiveDate !== todayStr) {
      user.streak = 1;
      user.lastActiveDate = todayStr;
      updated = true;
    }

    if (updated) {
      user = await this.UsersService.update(userId, {
        streak: user.streak,
        lastActiveDate: user.lastActiveDate,
      });
    }

    const result = { ...user };
    delete result.password;
    return result;
  }
}
