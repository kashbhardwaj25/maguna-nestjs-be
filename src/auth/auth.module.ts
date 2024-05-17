import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SequelizeModule } from '@nestjs/sequelize';

import { config } from 'src/config';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from '../users/users.module';
import { EmailOtp } from 'src/models/email-otp.model';
import { JwtStrategy } from './strategies/jwt-strategy';
import { LocalStrategy } from './strategies/local-strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    SequelizeModule.forFeature([EmailOtp]),
    JwtModule.register({
      secret: config.jwtSecret,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, AuthResolver],
})
export class AuthModule {}
