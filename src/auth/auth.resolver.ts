import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { HttpException, HttpStatus, UseGuards } from '@nestjs/common';

import {
  InvalidUser,
  InvalidCredentials,
  InvalidTokenProvided,
  UserWithEmailAlreadyExists,
  EmailVerificationOtpExpired,
} from 'src/utils/errors';
import { AuthInput } from './dto/auth.input';
import { AuthService } from './auth.service';
import { CurrentUser } from './auth.decorator';
import { LoginInput, User } from 'src/graphql';
import { AuthResponse } from './dto/auth.response';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { getErrorCodeAndMessage } from 'src/utils/helpers';
import { EMAIL_VERIFICATION_OTP_EXPIRY } from 'src/utils/constants';

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

      const verificationOtp = await this.authService.createVerificationOtp();

      await this.authService.sendVerificationEmail(
        newlyCreatedUser.email,
        verificationOtp,
      );

      await this.authService.saveEmailVerificationOtpInTable(
        verificationOtp,
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
  async verifyEmail(@Args('otp') otp: number): Promise<String> {
    try {
      const otpDetails = await this.authService.findOneByVerificationOtp(otp);

      if (!otpDetails) {
        throw new InvalidTokenProvided();
      }

      const otpAgeInMinutes =
        (new Date().getTime() - new Date(otpDetails.createdAt).getTime()) /
        1000 /
        60;

      if (otpAgeInMinutes > EMAIL_VERIFICATION_OTP_EXPIRY) {
        throw new EmailVerificationOtpExpired();
      }

      const user = await this.userService.findOne(otpDetails.userId);

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
      const otpDetails = await this.authService.findVerificationOtpByUserId(
        currentUser.userId,
      );

      if (otpDetails) {
        await this.authService.removeEmailOTP({ userId: currentUser.userId });
      }

      const verificationOtp = await this.authService.createVerificationOtp();

      await this.authService.sendVerificationEmail(
        currentUser.email,
        verificationOtp,
      );

      await this.authService.saveEmailVerificationOtpInTable(
        verificationOtp,
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

  @UseGuards(JwtAuthGuard)
  @Query('me')
  async me(@CurrentUser() currentUser: any): Promise<User> {
    try {
      const user = await this.userService.findOne(currentUser.userId);

      if (!user) {
        throw new InvalidUser();
      }

      return user;
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
