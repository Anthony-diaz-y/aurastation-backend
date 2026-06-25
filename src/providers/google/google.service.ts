import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';
import { IGoogleUser } from './interfaces/google.interface';

@Injectable()
export class GoogleService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async loginWithGoogle(
    googleUser: IGoogleUser,
  ): Promise<{ accessToken: string; user: object }> {
    const user = await this.usersService.findOrCreateGoogleUser(googleUser);

    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarId: user.avatarId,
      },
    };
  }
}
