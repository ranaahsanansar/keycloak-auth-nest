import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeycloakService } from './keycloak.service';
import { UserProfileEntity } from 'src/user/entities/user-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserProfileEntity])],
  controllers: [AuthController],
  providers: [AuthService, JwtService, KeycloakService],
})
export class AuthModule {}
