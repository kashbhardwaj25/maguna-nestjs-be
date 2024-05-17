import * as sgMail from '@sendgrid/mail';
import { Injectable } from '@nestjs/common';

import { config } from 'src/config';

@Injectable()
export class EmailService {
  constructor() {
    sgMail.setApiKey(config.sendGridApiKey);
  }

  async sendEmail(to: string, subject: string, html: string) {
    const msg = {
      to,
      from: config.sendGridFromAddress,
      subject,
      html,
    };

    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent');
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
