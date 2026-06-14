import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    UsersModule,

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'user',
      password: 'password123',
      database: 'aurastation',
      autoLoadEntities: true,
      synchronize: true,
    }),

    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
