import {
  Resolver,
  Query,
  Mutation,
  Args,
  ObjectType,
  Field,
} from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Listing, ListingStatus } from './listing.entity';
import { CreateListingInput } from './dto/create-listing.input';

@ObjectType()
class ListingType {
  @Field()
  id!: string;

  @Field()
  title!: string;

  @Field()
  description!: string;

  @Field()
  quantity!: string;

  @Field(() => ListingStatus)
  status!: ListingStatus;
}

@Resolver()
export class ListingsResolver {
  constructor(
    @InjectRepository(Listing)
    private listingsRepository: Repository<Listing>,
  ) {}

  @Query(() => [ListingType])
  async listings() {
    return this.listingsRepository.find();
  }

  @Mutation(() => ListingType)
  async createListing(@Args('input') input: CreateListingInput) {
    const listing = this.listingsRepository.create(input);
    return this.listingsRepository.save(listing);
  }
}
