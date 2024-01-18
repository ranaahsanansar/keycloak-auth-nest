import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { IsString, IsDate } from 'class-validator';
import { UserEntity } from './user.entity';
@Entity('user_profiles')
export class UserProfileEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  @IsString()
  country: string;

  @Column({ name: 'date_of_birth', nullable: true })
  @IsDate()
  dateOfBirth: Date;

  @Column({ nullable: true })
  @IsString()
  bio: string;

  @Column({ nullable: true })
  @IsString()
  headline: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToOne(() => UserEntity, (user) => user.userProfile)
  @JoinColumn()
  user: UserEntity;
}
