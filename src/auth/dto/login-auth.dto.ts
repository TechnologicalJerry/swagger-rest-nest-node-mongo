import { ApiProperty } from '@nestjs/swagger';

export class LoginAuthDto {
  @ApiProperty({ description: 'The identifier of the user' })
  identifier: string;

  @ApiProperty({ description: 'The password of the user' })
  password: string;
}
