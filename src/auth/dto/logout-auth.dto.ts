import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsMongoId } from 'class-validator';

export class LogoutAuthDto {
  @ApiProperty({
    description: 'The user ID to logout (optional - if not provided, uses the logged-in user from JWT token)',
    required: false,
    example: 'userid-userid-userid-userid',
  })
  @IsOptional()
  @IsString()
  @IsMongoId()
  userId?: string;
}
