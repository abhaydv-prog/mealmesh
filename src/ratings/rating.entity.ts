import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Pickup } from '../pickups/pickup.entity';

@Entity('ratings')
export class Rating {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToOne(() => Pickup)
  @JoinColumn()
  pickup!: Pickup;

  @ManyToOne(() => User)
  ratedBy!: User;

  @ManyToOne(() => User)
  ratedUser!: User;

  @Column({ type: 'int' })
  score!: number;

  @Column({ type: 'text', nullable: true })
  comment!: string;

  @CreateDateColumn()
  createdAt!: Date;
}