import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateListingInput {
  @Field()
  title!: string;

  @Field()
  description!: string;

  @Field()
  quantity!: string;
}
