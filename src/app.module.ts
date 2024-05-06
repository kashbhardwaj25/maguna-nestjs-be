import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { GraphQLModule } from './graphql.module';
import { UsersModule } from './users/users.module';
import { SequelizeModule } from './sequelize.module';

@Module({
  imports: [GraphQLModule, SequelizeModule, UsersModule, AuthModule],
})
export class AppModule {}
