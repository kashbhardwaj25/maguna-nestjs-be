import { Resolver, Mutation, Args } from '@nestjs/graphql';

import {
  InvalidCredentials,
  InvalidTokenProvided,
  UserWithEmailAlreadyExists,
} from 'src/utils/errors';
import { LoginInput } from 'src/graphql';
import { AuthInput } from './dto/auth.input';
import { AuthService } from './auth.service';
import { AuthResponse } from './dto/auth.response';
import { UsersService } from '../users/users.service';
import { getErrorCodeAndMessage } from 'src/utils/helpers';
import { HttpException, HttpStatus } from '@nestjs/common';

@Resolver()
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Mutation(() => AuthResponse)
  async login(@Args('input') authInput: LoginInput): Promise<AuthResponse> {
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

  @Mutation(() => AuthResponse)
  async register(@Args('input') authInput: AuthInput): Promise<AuthResponse> {
    try {
      const existingUser = await this.userService.findOneByEmail(
        authInput.email,
      );

      if (existingUser) {
        throw new UserWithEmailAlreadyExists();
      }

      const newlyCreatedUser = await this.userService.create({ ...authInput });

      const verificationToken =
        await this.authService.createVerificationToken();

      await this.authService.sendVerificationEmail(
        newlyCreatedUser.email,
        verificationToken,
      );

      await this.authService.saveEmailVerificationTokenInTable(
        verificationToken,
        newlyCreatedUser.id,
      );

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

  @Mutation(() => AuthResponse)
  async verifyEmail(@Args('token') token: string): Promise<AuthResponse> {
    try {
      const tokenDetails =
        await this.authService.findOneByVerificationToken(token);

      if (!tokenDetails) {
        throw new InvalidTokenProvided();
      }

      const user = await this.userService.findOne(tokenDetails.userId);

      const jwtToken = await this.authService.generateToken({
        email: user.email,
        id: user.id,
      });

      return {
        user,
        accessToken: jwtToken.access_token,
      };
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
