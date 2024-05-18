import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { AuthModule } from 'src/auth/auth.module';
import { ExpiredEmailTokenCleanupCronJob } from 'src/common/cron/handle-email-verification-token-cleanup.service';

@Module({
  imports: [ScheduleModule.forRoot(), AuthModule],
  providers: [ExpiredEmailTokenCleanupCronJob],
})
export class CronModule {}
