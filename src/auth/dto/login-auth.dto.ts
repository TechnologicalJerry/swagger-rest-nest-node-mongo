import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class LoginAuthDto {
  @ApiProperty({
    description: 'The identifier of the user (email or username)',
  })
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @ApiProperty({ description: 'The password of the user' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
