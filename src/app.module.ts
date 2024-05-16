import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { GraphQLModule } from './graphql.module';
import { UsersModule } from './users/users.module';
import { SequelizeModule } from './sequelize.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule,
    SequelizeModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
