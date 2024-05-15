import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class AuthInput {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;
}
