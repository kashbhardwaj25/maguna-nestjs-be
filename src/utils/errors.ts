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