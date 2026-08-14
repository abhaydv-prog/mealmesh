import {
  Resolver,
  Query,
  Mutation,
  Args,
  ObjectType,
  Field,
  Float,
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

  @Query(() => [ListingType])
async nearbyListings(
  @Args('latitude', { type: () => Float }) latitude: number,
  @Args('longitude', { type: () => Float }) longitude: number,
  @Args('radiusKm', { type: () => Float }) radiusKm: number,
) {
  const radiusMeters = radiusKm * 1000;

  return this.listingsRepository
    .createQueryBuilder('listing')
    .where(
      `ST_DWithin(
        listing.location,
        ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography,
        :radiusMeters
      )`,
      { longitude, latitude, radiusMeters },
    )
    .getMany();
}

  @Mutation(() => ListingType)
  @UseGuards(JwtAuthGuard)
  async createListing(
    @Args('input') input: CreateListingInput,
    @CurrentUser() currentUser: any,
  ) {
    const listing = this.listingsRepository.create({
      title: input.title,
      description: input.description,
      quantity: input.quantity,
      location: {
        type: 'Point',
        coordinates: [input.longitude, input.latitude],
      } as any,
      donor: { id: currentUser.userId },
    });
    return this.listingsRepository.save(listing);
  }
}
