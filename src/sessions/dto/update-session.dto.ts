import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsDate } from 'class-validator';

export class UpdateSessionDto {
  @ApiProperty({ description: 'Logout timestamp', required: false })
  @IsOptional()
  @IsDate()
  logoutTimestamp?: Date;

  @ApiProperty({ description: 'Session status', enum: ['active', 'logged_out'], required: false })
  @IsOptional()
  @IsEnum(['active', 'logged_out'])
  status?: 'active' | 'logged_out';
}
