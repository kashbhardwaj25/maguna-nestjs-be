import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { User } from './users/user.model';
import { AppService } from './app.service';
import { AppController } from './app.controller';

@Module({
  imports: [
    SequelizeModule.forRoot({
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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
