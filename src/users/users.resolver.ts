import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';

import { User } from './user.model'; // Import generated class
import { UsersService } from './users.service';
import { CreateUserInput } from './dto/create-user.input'; // Import generated class

@Resolver('User')
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query('users')
  async getUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Mutation('createUser')
  async createUser(@Args('input') input: CreateUserInput): Promise<User> {
    return this.usersService.create(input);
  }
}
