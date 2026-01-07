import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ description: 'The username of the user' })
    userName: string;

    @ApiProperty({ description: 'The first name of the user' })
    firstName: string;

    @ApiProperty({ description: 'The last name of the user' })
    lastName: string;

    @ApiProperty({ description: 'The email of the user' })
    email: string;

    @ApiProperty({ description: 'The phone number of the user' })
    phoneNumber: string;

    @ApiProperty({ description: 'The password of the user' })
    password: string;

    @ApiProperty({ description: 'The confirm password of the user' })
    confirmPassword?: string;

    @ApiProperty({ description: 'The role of the user' })
    role?: string;
}
