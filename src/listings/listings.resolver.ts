import {
  Resolver,
  Query,
  Mutation,
  Args,
  ObjectType,
  Field,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Listing, ListingStatus } from './listing.entity';
import { CreateListingInput } from './dto/create-listing.input';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

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
  @UseGuards(JwtAuthGuard)
  async createListing(
    @Args('input') input: CreateListingInput,
    @CurrentUser() currentUser: any,
  ) {
    const listing = this.listingsRepository.create({
      ...input,
      donor: { id: currentUser.userId },
    });
    return this.listingsRepository.save(listing);
  }
}
