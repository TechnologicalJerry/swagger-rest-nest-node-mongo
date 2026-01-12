import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsEmail,
  Min,
  Max,
  IsOptional,
  Matches,
} from 'class-validator';

export class TestingDto {
  @ApiProperty({
    description: 'The full name of the user',
    example: 'Rajat Verma',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'rajat.verma@technojerry.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'The password of the user (min 8 chars)',
    example: 'SecurePass123',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: 'Confirm password (must match password)',
    example: 'SecurePass123',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  passwordConfirm: string;

  @ApiProperty({
    description: 'User age (optional, 18-100)',
    example: 24,
  })
  @IsOptional()
  @Min(18)
  @Max(100)
  age?: number;

  @ApiProperty({
    description: 'Phone number (optional, Indian format)',
    example: '+919876543210',
    required: false,
  })
  @IsOptional()
  @Matches(/^\+91[6-9]\d{9}$/, {
    message: 'Phone must be valid Indian mobile number starting with +91',
  })
  phone?: string;
}
