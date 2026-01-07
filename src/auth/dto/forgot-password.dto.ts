import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
    @ApiProperty({ description: 'The email or username of the user to reset the password' })
    identifier: string;
}
