import * as sgMail from '@sendgrid/mail';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { config } from 'src/config';

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {
    sgMail.setApiKey(this.configService.get<string>(config.sendGridApiKey));
  }

  async sendEmail(to: string, subject: string, html: string) {
    const msg = {
      to,
      from: config.sendGridFromAddress,
      subject,
      html,
    };

    try {
      await sgMail.send(msg);
    } catch (error) {
      console.error(`Error sending email to ${to}: `, error);
      if (error.response) {
        console.error(error.response.body);
      }
    }
  }
}
