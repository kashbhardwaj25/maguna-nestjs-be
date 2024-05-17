import { Dialect } from 'sequelize';
import { Module } from '@nestjs/common';
import { SequelizeModule as NestJsSequelizeModule } from '@nestjs/sequelize';

import { config } from './config';
import { User } from './users/user.model';

@Module({
  imports: [
    NestJsSequelizeModule.forRoot({
      dialect: config.database.dialect as Dialect,
      host: config.database.host,
      port: parseInt(config.database.port),
      username: config.database.username,
      password: config.database.password,
      database: config.database.database,
      models: [User],
      autoLoadModels: true,
      synchronize: true,
    }),
  ],
})
export class SequelizeModule {}
