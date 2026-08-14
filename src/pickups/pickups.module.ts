import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pickup } from './pickup.entity';
import { Listing } from '../listings/listing.entity';
import { PickupsService } from './pickups.service';
import { PickupsResolver } from './pickups.resolver';


@Module({
  imports: [TypeOrmModule.forFeature([Pickup, Listing])],
  providers: [PickupsService, PickupsResolver],
  exports: [TypeOrmModule],
})
export class PickupsModule {}