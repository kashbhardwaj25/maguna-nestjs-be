
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class LoginInput {
    email: string;
    password: string;
}

export class RegisterInput {
    name: string;
    email: string;
    password: string;
}

export class User {
    id: string;
    name: string;
    email: string;
    isEmailVerified: boolean;
}

export class AuthResponse {
    accessToken: string;
    user: User;
}

export abstract class IQuery {
    abstract me(): User | Promise<User>;

    abstract users(): Nullable<Nullable<User>[]> | Promise<Nullable<Nullable<User>[]>>;
}

export abstract class IMutation {
    abstract login(input?: Nullable<LoginInput>): AuthResponse | Promise<AuthResponse>;

    abstract register(input?: Nullable<RegisterInput>): AuthResponse | Promise<AuthResponse>;

    abstract verifyEmail(otp?: Nullable<number>): string | Promise<string>;

    abstract resendVerificationEmail(): string | Promise<string>;
}

type Nullable<T> = T | null;
