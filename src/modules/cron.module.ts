import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { AuthModule } from 'src/auth/auth.module';
import { ExpiredEmailOTPCleanupCronJob } from 'src/common/cron/handle-email-verification-otp-cleanup.service';

@Module({
  imports: [ScheduleModule.forRoot(), AuthModule],
  providers: [ExpiredEmailOTPCleanupCronJob],
})
export class CronModule {}
