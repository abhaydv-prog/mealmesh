import {
  Resolver,
  Mutation,
  Query,
  Args,
  ObjectType,
  Field,
} from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import { UserRole } from '../users/user.entity';

@ObjectType()
class UserResponse {
  @Field()
  id!: string;

  @Field()
  name!: string;

  @Field()
  email!: string;

  @Field(() => UserRole)
  role!: UserRole;
}

@ObjectType()
class AuthResponse {
  @Field()
  accessToken!: string;

  @Field(() => UserResponse)
  user!: UserResponse;
}

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Query(() => String)
  healthCheck() {
    return 'Auth module is working';
  }

  @Mutation(() => AuthResponse)
  async register(@Args('input') input: RegisterInput) {
    return this.authService.register(
      input.name,
      input.email,
      input.password,
      input.role,
    );
  }

  @Mutation(() => AuthResponse)
  async login(@Args('input') input: LoginInput) {
    return this.authService.login(input.email, input.password);
  }
}
