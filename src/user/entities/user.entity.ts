import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserAccountStatusEnum } from '../utils/user-enum';
import { UserProfileEntity } from './user-profile.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'keycloak_uuid',
    type: 'uuid',
    unique: true,
    nullable: false,
  })
  keycloak_uuid: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({
    name: 'user_name',
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: false,
  })
  user_name: string;

  @Column({ name: 'first_name', type: 'varchar', length: 50, nullable: true })
  first_name: string;

  @Column({ name: 'middle_name', type: 'varchar', length: 50, nullable: true })
  middle_name: string;

  @Column({ name: 'last_name', type: 'varchar', length: 50, nullable: true })
  last_name: string;

  @Column({
    name: 'role',
    type: 'varchar',
    length: 50,
    nullable: false,
    default: 'USER',
  })
  role: string;

  @Column({
    name: 'account_status',
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  account_status: string;

  @Column({
    name: 'is_email_verified',
    type: 'boolean',
    nullable: false,
    default: false,
  })
  is_email_verified: boolean;

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

  // --------------------

  @OneToOne(() => UserProfileEntity, (userProfile) => userProfile.user)
  userProfile: UserProfileEntity;
}
