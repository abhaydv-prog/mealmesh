import { Resolver, Mutation, Args, ObjectType, Field, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from './rating.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@ObjectType()
class RatingType {
  @Field()
  id!: string;

  @Field(() => Int)
  score!: number;
}

@Resolver()
export class RatingsResolver {
  constructor(
    @InjectRepository(Rating)
    private ratingsRepository: Repository<Rating>,
  ) {}

  @Mutation(() => RatingType)
  @UseGuards(JwtAuthGuard)
  async createRating(
    @Args('pickupId') pickupId: string,
    @Args('ratedUserId') ratedUserId: string,
    @Args('score', { type: () => Int }) score: number,
    @CurrentUser() currentUser: any,
  ) {
    const rating = this.ratingsRepository.create({
      pickup: { id: pickupId },
      ratedBy: { id: currentUser.userId },
      ratedUser: { id: ratedUserId },
      score,
    });

    return this.ratingsRepository.save(rating);
  }
}