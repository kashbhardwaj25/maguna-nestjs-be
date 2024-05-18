import { join } from 'path';
import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule as NestJsGraphQLModule } from '@nestjs/graphql';

@Module({
  imports: [
    NestJsGraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'], // Path to your GraphQL schema file
      playground: true,
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'), // Generated TypeScript definitions
        outputAs: 'class',
      },
    }),
  ],
})
export class GraphQLModule {}
