import { InputType, Field, Float } from '@nestjs/graphql';

@InputType()
export class CreateListingInput {
  @Field()
  title!: string;

  @Field()
  description!: string;

  @Field()
  quantity!: string;

  @Field(() => Float)
  latitude!: number;

  @Field(() => Float)
  longitude!: number;
}
