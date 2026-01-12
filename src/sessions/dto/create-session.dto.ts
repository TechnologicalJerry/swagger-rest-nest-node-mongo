import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';
import { Types } from 'mongoose';

export class CreateSessionDto {
  @ApiProperty({ description: 'The user ID for the session' })
  @IsNotEmpty()
  @IsString()
  userId: string | Types.ObjectId;
}
