import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { User } from './user.model';
import { CreateUserInput } from './dto/create-user.input';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }

  async create(createUserInput: CreateUserInput): Promise<User> {
    const newUser = new this.userModel({
      ...createUserInput,
    });

    return newUser.save();
  }

  // Additional methods can be added here, such as findById, update, delete, etc.
}
