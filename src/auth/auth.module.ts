import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SequelizeModule } from '@nestjs/sequelize';

import { config } from 'src/config';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from '../users/users.module';
import { EmailToken } from 'src/models/email-token.model';
import { JwtStrategy } from './strategies/jwt-strategy';
import { LocalStrategy } from './strategies/local-strategy';
import { EmailService } from 'src/services/sendgrid.service';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    SequelizeModule.forFeature([EmailToken]),
    JwtModule.register({
      secret: config.jwtSecret,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    AuthResolver,
    EmailService,
    LocalStrategy,
  ],
})
export class AuthModule {}
