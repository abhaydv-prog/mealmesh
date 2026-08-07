import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Listing } from './listing.entity';
import { ListingsService } from './listings.service';

@Module({
  imports: [TypeOrmModule.forFeature([Listing])],
  providers: [ListingsService],
  exports: [TypeOrmModule],
})
export class ListingsModule {}
