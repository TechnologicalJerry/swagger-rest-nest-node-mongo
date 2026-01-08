import {
  BadRequestException,
  UnauthorizedException,
  Injectable,
} from '@nestjs/common';
import { SignupAuthDto } from './dto/signup-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signupAuthDto: SignupAuthDto) {
    const existingUser = await this.usersService.findByIdentifier(
      signupAuthDto.email || signupAuthDto.userName,
    );
    if (existingUser) {
      throw new BadRequestException('User already registered');
    }

    const hashedPassword = await bcrypt.hash(signupAuthDto.password, 10);

    const user = await this.usersService.create({
      userName: signupAuthDto.userName,
      firstName: signupAuthDto.firstName,
      lastName: signupAuthDto.lastName,
      email: signupAuthDto.email,
      phoneNumber: signupAuthDto.phoneNumber,
      password: hashedPassword,
      role: signupAuthDto.role,
    });

    return this.generateToken(user);
  }

  async login(loginAuthDto: LoginAuthDto) {
    const user = await this.usersService.findByIdentifier(
      loginAuthDto.identifier,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginAuthDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateToken(user);
  }

  async forgotPassword(identifier: string) {
    const user = await this.usersService.findByIdentifier(identifier);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // later: email service
    return { message: 'Password reset link sent (mock)' };
  }

  private generateToken(user: User) {
    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
