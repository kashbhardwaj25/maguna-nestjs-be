import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.model';
import { AuthInput } from './dto/auth.input';
import { AuthResponse } from './dto/auth.response';

@Resolver()
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Mutation(() => AuthResponse)
  async login(@Args('authInput') authInput: AuthInput): Promise<AuthResponse> {
    const user = await this.authService.validateUser(
      authInput.email,
      authInput.password,
    );
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const token = await this.authService.login(user);
    return {
      user,
      accessToken: token.access_token,
    };
  }

  @Mutation(() => User)
  async register(@Args('authInput') authInput: AuthInput): Promise<User> {
    //Todo: Check whether user exists with that email first.
    return this.userService.create({ ...authInput });
  }
}
