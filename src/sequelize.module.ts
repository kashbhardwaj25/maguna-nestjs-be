import { Module } from '@nestjs/common';
import { SequelizeModule as NestJsSequelizeModule } from '@nestjs/sequelize';

import { User } from './users/user.model';

@Module({
  imports: [
    NestJsSequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'maguna_db',
      models: [User], // Include all models here
      autoLoadModels: true, // Automatically load models
      synchronize: true, // Synchronize models with the database (not recommended for production)
    }),
  ],
})
export class SequelizeModule {}
