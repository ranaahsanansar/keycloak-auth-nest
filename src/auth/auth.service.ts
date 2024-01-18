import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { CreateUserReturnI } from './utils/returns.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserAccountStatusEnum } from 'src/user/utils/user-enum';
import { Repository } from 'typeorm';
import { KeycloakService } from './keycloak.service';
import { CreateKeycloakUserT } from './utils/types';
import { UserProfileEntity } from 'src/user/entities/user-profile.entity';
import { LoginAuthDto, RefreshTokenDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserProfileEntity)
    private readonly userProfileEntity: Repository<UserProfileEntity>,
    private readonly keycloakService: KeycloakService,
  ) {}

  async create(body: CreateUserDto): Promise<CreateUserReturnI> {
    try {
      // Check if the user is exist in database then throw error
      // Check if the user is exist in database then throw error
      const existingUser: UserEntity = await this.userRepository.findOne({
        where: { user_name: body.userName },
      });

      if (existingUser) {
        throw new HttpException('User already exists', 400);
      }

      // save user in keycloak
      const newUser: CreateKeycloakUserT = {
        username: body.userName,
        enabled: true,
        emailVerified: false,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        credentials: [
          {
            type: 'password',
            value: body.password,
            temporary: false,
          },
        ],
      };

      await this.keycloakService.generateClientToken();
      await this.keycloakService.resgiterUserInKeycloak(newUser);

      const newCreatedUser = await this.keycloakService.getUserByUsername(
        body.userName,
      );
      /**
        {
          id: '5aab36b4-41c9-4ca6-ab9a-61c438581a6f',
          createdTimestamp: 1705331568473,
          username: 'sdfdssd3f',
          enabled: true,
          totp: false,
          emailVerified: false,
          firstName: 'Rana',
          lastName: 'Ansar',
          email: 'asnsdf@gmail.com',
          disableableCredentialTypes: [],
          requiredActions: [],
          notBefore: 0,
          access: {
            manageGroupMembership: true,
            view: true,
            mapRoles: true,
            impersonate: true,
            manage: true,
          },
        }
 */

      console.log('Return User', newCreatedUser);

      // Save Data in datbase
      const userData: UserEntity = new UserEntity();
      userData.email = body.email;
      userData.user_name = body.userName;
      userData.first_name = body.firstName;
      userData.middle_name = body.middleName;
      userData.last_name = body.lastName;
      userData.role = 'USER';
      userData.account_status = UserAccountStatusEnum.INIT;
      userData.is_email_verified = false;
      userData.keycloak_uuid = newCreatedUser.id;

      await this.userRepository.save(userData);

      const userProfile = new UserProfileEntity();

      userProfile.user = userData;

      await this.userProfileEntity.save(userProfile);

      return { message: 'User created Succesfuly' };
    } catch (error) {
      console.log(error);
      // throw new InternalServerErrorException('Interal server error');
      throw new HttpException(error.message, error.status);
    }
  }

  async login(body: LoginAuthDto) {
    try {
      const user = await this.userRepository.findOne({
        where: [{ user_name: body.username }, { email: body.username }],
      });

      if (!user) {
        throw new HttpException('User not found', 404);
      }

      if (
        user.account_status === UserAccountStatusEnum.BAN ||
        user.account_status === UserAccountStatusEnum.PARMANENT_BAN
      ) {
        throw new HttpException('User is Banned', HttpStatus.FORBIDDEN);
      }

      if (user.account_status === UserAccountStatusEnum.PARMANENT_DEACTIVATED) {
        throw new HttpException('User is deleted', HttpStatus.FORBIDDEN);
      }

      await this.keycloakService.generateClientToken();

      return await this.keycloakService.loginUser(
        user.user_name,
        body.password,
      );
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async refreshToken(body: RefreshTokenDto) {
    try {
      await this.keycloakService.generateClientToken();

      return await this.keycloakService.refreshToken(body.refreshToken);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async test() {
    try {
      // console.log(await this.keycloakService.generateClientToken());
      // console.log(await this.keycloakService.resgiterUserInKeycloak());
      return 'ok';
    } catch (error) {
      console.log(error);
    }
  }
}
