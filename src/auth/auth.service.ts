import { Op } from 'sequelize';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { UsersService } from '../users/users.service';
import { EmailOTP } from 'src/models/email-otp.model';
import { EmailService } from 'src/services/sendgrid.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(EmailOTP)
    private emailOTPModel: typeof EmailOTP,
    private jwtService: JwtService,
    private userService: UsersService,
    private emailService: EmailService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      return user;
    }
    return null;
  }

  async generateToken(user: any) {
    const payload = { email: user.email, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async createVerificationOTP() {
    return Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
  }

  async findOneByVerificationOTP(otp: number): Promise<EmailOTP | undefined> {
    return this.emailOTPModel.findOne({
      where: { verificationOTP: otp },
    });
  }

  async findVerificationOTPByUserId(
    userId: string,
  ): Promise<EmailOTP | undefined> {
    return this.emailOTPModel.findOne({
      where: { userId },
    });
  }

  async saveEmailVerificationOTPInTable(
    otp: number,
    userId: string,
  ): Promise<EmailOTP | undefined> {
    return this.emailOTPModel.create({
      verificationOTP: otp,
      userId,
    });
  }

  async sendVerificationEmail(email: string, otp: number) {
    await this.emailService.sendEmail(
      email,
      'Verify your email.',
      `<strong>Use this OTP to verify your email: ${otp}`,
    );
  }

  async removeEmailOTP(condition = {}) {
    return this.emailOTPModel.destroy({
      where: condition,
      force: true,
    });
  }

  async removeExpiredEmailVerificationOTPS() {
    const now = new Date();
    const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);

    await this.emailOTPModel.destroy({
      where: {
        createdAt: {
          [Op.lt]: tenMinutesAgo,
        },
      },
      force: true,
    });
  }
}
