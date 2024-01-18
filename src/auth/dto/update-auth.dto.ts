import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-auth.dto';

export class UpdateAuthDto extends PartialType(CreateUserDto) {}
