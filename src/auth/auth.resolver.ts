import { Resolver, Mutation, Args } from '@nestjs/graphql';

import { User } from '../users/user.model';
import { AuthInput } from './dto/auth.input';
import { AuthService } from './auth.service';
import { AuthResponse } from './dto/auth.response';
import { UsersService } from '../users/users.service';
import { getErrorCodeAndMessage } from 'src/utils/helpers';
import { HttpException, HttpStatus } from '@nestjs/common';
import {
  InvalidCredentials,
  UserWithEmailAlreadyExists,
} from 'src/utils/errors';

@Resolver()
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Mutation(() => AuthResponse)
  async login(@Args('authInput') authInput: AuthInput): Promise<AuthResponse> {
    try {
      const user = await this.authService.validateUser(
        authInput.email,
        authInput.password,
      );

      if (!user) {
        throw new InvalidCredentials();
      }

      const token = await this.authService.generateToken(user);

      return {
        user,
        accessToken: token.access_token,
      };
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Mutation(() => User)
  async register(@Args('input') authInput: AuthInput): Promise<AuthResponse> {
    try {
      const existingUser = await this.userService.findOneByEmail(
        authInput.email,
      );

      if (existingUser) {
        throw new UserWithEmailAlreadyExists();
      }

      const newlyCreatedUser = await this.userService.create({ ...authInput });

      const token = await this.authService.generateToken({
        email: newlyCreatedUser.email,
        id: newlyCreatedUser.id,
      });

      return {
        user: newlyCreatedUser,
        accessToken: token.access_token,
      };
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
