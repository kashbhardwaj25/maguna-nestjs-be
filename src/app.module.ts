import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { GraphQLModule } from './modules/graphql.module';
import { UsersModule } from './users/users.module';
import { SequelizeModule } from './modules/sequelize.module';
import { CronModule } from './modules/cron.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CronModule,
    GraphQLModule,
    SequelizeModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
