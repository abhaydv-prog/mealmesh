import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { registerEnumType } from '@nestjs/graphql';
import { User } from '../users/user.entity';
import { Listing } from '../listings/listing.entity';

export enum PickupStatus {
  ASSIGNED = 'ASSIGNED',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

registerEnumType(PickupStatus, { name: 'PickupStatus' });

@Entity('pickups')
export class Pickup {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToOne(() => Listing)
  @JoinColumn()
  listing!: Listing;

  @ManyToOne(() => User)
  volunteer!: User;

  @Column({
    type: 'enum',
    enum: PickupStatus,
    default: PickupStatus.ASSIGNED,
  })
  status!: PickupStatus;

  @CreateDateColumn()
  createdAt!: Date;
}