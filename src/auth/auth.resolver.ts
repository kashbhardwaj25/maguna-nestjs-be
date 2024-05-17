import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { HttpException, HttpStatus, UseGuards } from '@nestjs/common';

import {
  InvalidCredentials,
  InvalidTokenProvided,
  UserWithEmailAlreadyExists,
  EmailVerificationTokenExpired,
} from 'src/utils/errors';
import { LoginInput } from 'src/graphql';
import { AuthInput } from './dto/auth.input';
import { AuthService } from './auth.service';
import { CurrentUser } from './auth.decorator';
import { AuthResponse } from './dto/auth.response';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { getErrorCodeAndMessage } from 'src/utils/helpers';
import { EMAIL_VERIFICATION_TOKEN_EXPIRY } from 'src/utils/constants';

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

  @Mutation(() => String)
  @UseGuards(JwtAuthGuard)
  async verifyEmail(@Args('token') token: string): Promise<String> {
    try {
      const tokenDetails =
        await this.authService.findOneByVerificationToken(token);

      if (!tokenDetails) {
        throw new InvalidTokenProvided();
      }

      const tokenAgeInMinutes =
        (new Date().getTime() - new Date(tokenDetails.createdAt).getTime()) /
        1000 /
        60;

      if (tokenAgeInMinutes > EMAIL_VERIFICATION_TOKEN_EXPIRY) {
        throw new EmailVerificationTokenExpired();
      }

      const user = await this.userService.findOne(tokenDetails.userId);

      await this.userService.update(
        {
          id: user.id,
        },
        {
          isEmailVerified: true,
        },
      );

      return 'Email verification is successful!';
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Mutation(() => String)
  @UseGuards(JwtAuthGuard)
  async resendVerificationEmail(
    @CurrentUser() currentUser: any,
  ): Promise<String> {
    try {
      const tokenDetails = await this.authService.findVerificationTokenByUserId(
        currentUser.userId,
      );

      if (tokenDetails) {
        await this.authService.removeEmailToken({ userId: currentUser.userId });
      }

      const verificationToken =
        await this.authService.createVerificationToken();

      await this.authService.sendVerificationEmail(
        currentUser.email,
        verificationToken,
      );

      await this.authService.saveEmailVerificationTokenInTable(
        verificationToken,
        currentUser.userId,
      );

      return 'Verification email is sent again!';
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
