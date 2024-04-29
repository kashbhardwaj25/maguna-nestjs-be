import { join } from 'path';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { SequelizeModule } from '@nestjs/sequelize';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { User } from './users/user.model';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'], // Path to your GraphQL schema file
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'), // Generated TypeScript definitions
        outputAs: 'class',
      },
    }),
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
    UsersModule,
  ],
})
export class AppModule {}
