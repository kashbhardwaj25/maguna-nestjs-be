import { Resolver, Query } from '@nestjs/graphql';

import { User } from './user.model';
import { UsersService } from './users.service';

@Resolver('User')
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query('users')
  async getUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }
}
