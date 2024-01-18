import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    // private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const publicKey = `-----BEGIN PUBLIC KEY-----\n${process.env.PUBLICKEY}\n-----END PUBLIC KEY-----`;
      // const payload = await this.jwtService.verifyAsync(token, {
      //   // secret: jwtConstants.secret,
      //   publicKey: publicKey,
      //   algorithms: ['RS256'],
      // });

      const payload = jwt.verify(token, publicKey, {
        algorithms: ['RS256'],
      }) as any;

      console.log('Payload : ', payload);

      const userData = await this.userRepository.findOne({
        where: { keycloak_uuid: payload.sub },
      });

      if (!userData) {
        throw new UnauthorizedException("User doesn't exist");
      }

      payload.userId = userData.id;

      if (userData.role !== 'USER') {
        throw new UnauthorizedException('User is not authorized');
      }

      request['user'] = payload;
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException(e.message);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
