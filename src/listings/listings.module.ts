import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Listing } from './listing.entity';
import { ListingsService } from './listings.service';
import { ListingsResolver } from './listings.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Listing])],
  providers: [ListingsService, ListingsResolver],
  exports: [TypeOrmModule],
})
export class ListingsModule {}
