import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { AuthService } from '../../auth/auth.service';

@Injectable()
export class ExpiredEmailOTPCleanupCronJob {
  constructor(private readonly authService: AuthService) {}

  @Cron(CronExpression.EVERY_DAY_AT_10PM)
  async handleCron() {
    await this.authService.removeExpiredEmailVerificationOtps();
    console.log('Expired email verification otps deleted!');
  }
}
