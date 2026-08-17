import {
  Resolver,
  Query,
  Mutation,
  Subscription,
  Args,
  ObjectType,
  Field,
} from '@nestjs/graphql';
import { UseGuards, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pickup, PickupStatus } from './pickup.entity';
import { Listing, ListingStatus } from '../listings/listing.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { pubSub } from '../pubsub';

@ObjectType()
class PickupType {
  @Field()
  id!: string;

  @Field(() => PickupStatus)
  status!: PickupStatus;
}

const PICKUP_STATUS_UPDATED = 'pickupStatusUpdated';

@Resolver()
export class PickupsResolver {
  constructor(
    @InjectRepository(Pickup)
    private pickupsRepository: Repository<Pickup>,
    @InjectRepository(Listing)
    private listingsRepository: Repository<Listing>,
  ) {}

  @Mutation(() => PickupType)
  @UseGuards(JwtAuthGuard)
  async acceptPickup(
    @Args('listingId') listingId: string,
    @CurrentUser() currentUser: any,
  ) {
    const listing = await this.listingsRepository.findOne({
      where: { id: listingId },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.status !== ListingStatus.AVAILABLE) {
      throw new BadRequestException('Listing is not available');
    }

    listing.status = ListingStatus.CLAIMED;
    await this.listingsRepository.save(listing);

    const pickup = this.pickupsRepository.create({
      listing: { id: listingId },
      volunteer: { id: currentUser.userId },
      status: PickupStatus.ASSIGNED,
    });

    const saved = await this.pickupsRepository.save(pickup);

    await pubSub.publish(PICKUP_STATUS_UPDATED, {
      pickupStatusUpdated: saved,
    });

    return saved;
  }

  @Mutation(() => PickupType)
  @UseGuards(JwtAuthGuard)
  async updatePickupStatus(
    @Args('pickupId') pickupId: string,
    @Args('status', { type: () => PickupStatus }) status: PickupStatus,
  ) {
    const pickup = await this.pickupsRepository.findOne({
      where: { id: pickupId },
    });

    if (!pickup) {
      throw new NotFoundException('Pickup not found');
    }

    pickup.status = status;
    const saved = await this.pickupsRepository.save(pickup);

    await pubSub.publish(PICKUP_STATUS_UPDATED, {
      pickupStatusUpdated: saved,
    });

    return saved;
  }

  @Subscription(() => PickupType)
  pickupStatusUpdated() {
    return pubSub.asyncIterableIterator(PICKUP_STATUS_UPDATED);
  }
}