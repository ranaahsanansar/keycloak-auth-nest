import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ nullable: false, example: 'asn.cs21@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    nullable: false,
    example: 'asn',
  })
  @IsString()
  @IsNotEmpty()
  userName: string;

  @ApiProperty({
    example: 'Ahsan@123',
  })
  @IsString()
  // @MinLength(8, { message: 'Password must be at least 8 characters long' })
  // @Matches(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{8,}$/,
  //   {
  //     message:
  //       'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character (@$!%*?&).',
  //   },
  // )
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    nullable: false,
    example: 'Ahsan@123',
  })
  @IsString()
  @IsNotEmpty()
  confirmPassword: string;

  @ApiProperty({
    nullable: true,
    example: 'Rana',
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    nullable: true,
    example: 'Ahsan',
  })
  @IsOptional()
  @IsString()
  middleName?: string;

  @ApiProperty({
    nullable: true,
    example: 'Ansar',
  })
  @IsOptional()
  @IsString()
  lastName?: string;
}
