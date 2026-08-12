import { InputType, Field } from '@nestjs/graphql';
import { UserRole } from '../../users/user.entity';

@InputType()
export class RegisterInput {
  @Field()
  name!: string;

  @Field()
  email!: string;

  @Field()
  password!: string;

  @Field(() => UserRole)
  role!: UserRole;
}
