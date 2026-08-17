import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rating } from './rating.entity';
import { RatingsService } from './ratings.service';
import { RatingsResolver } from './ratings.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Rating])],
  providers: [RatingsService, RatingsResolver],
  exports: [TypeOrmModule],
})
export class RatingsModule {}