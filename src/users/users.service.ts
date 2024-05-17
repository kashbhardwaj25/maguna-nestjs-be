import * as bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { User } from '../models/user.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}
  async findOne(id: string): Promise<User | undefined> {
    return this.userModel.findOne({ where: { id } });
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ where: { email } });
  }

  async update(condition = {}, payload = {}) {
    return this.userModel.update(payload, {
      where: condition,
    });
  }

  async findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }

  async create({ email, password, name }): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.userModel.create({ name, email, password: hashedPassword });
  }
  // Additional methods can be added here, such as findById, update, delete, etc.
}
