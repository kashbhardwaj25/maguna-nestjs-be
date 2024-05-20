import { HttpException, HttpStatus } from '@nestjs/common';

export class UserWithEmailAlreadyExists extends HttpException {
  constructor() {
    super(
      {
        message: 'User with the provided email already exists.',
        code: 'USER_WITH_EMAIL_ALREADY_EXISTS',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class InvalidCredentials extends HttpException {
  constructor() {
    super(
      {
        message: 'Invalid Credentials.',
        code: 'INVALID_CREDENTIALS',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class InvalidTokenProvided extends HttpException {
  constructor() {
    super(
      {
        message: 'Invalid Token Provided.',
        code: 'INVALID_TOKEN_PROVIDED',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class EmailVerificationOTPExpired extends HttpException {
  constructor() {
    super(
      {
        message: 'The email verification OTP has expired.',
        code: 'EMAIL_VERIFICATION_OTP_EXPIRED',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class InvalidUser extends HttpException {
  constructor() {
    super(
      {
        message: 'Bad Auth Token Provided',
        code: 'INVALID_USER',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
