import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { UsersService } from '../users/users.service';
import { EmailToken } from 'src/models/email-token.model';
import { EmailService } from 'src/services/sendgrid.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(EmailToken)
    private emailTokenModel: typeof EmailToken,
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

  async createVerificationToken() {
    return uuidv4();
  }

  async findOneByVerificationToken(
    token: string,
  ): Promise<EmailToken | undefined> {
    return this.emailTokenModel.findOne({
      where: { verificationToken: token },
    });
  }

  async saveEmailVerificationTokenInTable(
    token: string,
    userId: string,
  ): Promise<EmailToken | undefined> {
    return this.emailTokenModel.create({
      verificationToken: token,
      userId,
    });
  }

  async sendVerificationEmail(email: string, token: string) {
    await this.emailService.sendEmail(
      email,
      'Verify your email.',
      `<strong>Click this link to verify your email: http://localhost:3011/verify-email?token=${token}<strong>`,
    );
  }
}
