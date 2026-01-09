import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'The email or username of the user to reset the password',
  })
  @IsString()
  @IsNotEmpty()
  identifier: string;
}
