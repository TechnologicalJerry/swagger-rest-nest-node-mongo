import {
  BadRequestException,
  UnauthorizedException,
  Injectable,
} from '@nestjs/common';
import { SignupAuthDto } from './dto/signup-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { SessionsService } from '../sessions/sessions.service';
import { User } from '../users/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { TestingDto } from './dto/testing.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly sessionsService: SessionsService,
    private readonly jwtService: JwtService,
  ) { }

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

    // Create session for the newly registered user
    await this.sessionsService.create({ userId: user._id });

    // Generate access token
    // const tokenData = this.generateToken(user);

    // Return proper response structure
    return {
      message: 'User registered successfully',
      user: {
        id: user._id.toString(),
        userName: user.userName,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
      // access_token: tokenData.access_token,
    };
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

    const existingSession = await this.sessionsService.findActiveSession(
      user._id,
    );

    if (existingSession) {
      // User is already logged in, return user data without creating new session
      const tokenData = this.generateToken(user);

      return {
        message: 'You are already logged in',
        user: {
          id: user._id.toString(),
          userName: user.userName,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role,
        },
        access_token: tokenData.access_token,
        sessionId: existingSession._id.toString(),
      };
    }

    // Create new session for the logged in user
    const session = await this.sessionsService.create({ userId: user._id });

    // Generate access token
    const tokenData = this.generateToken(user);

    // Return proper response structure
    return {
      message: 'Login successful',
      user: {
        id: user._id.toString(),
        userName: user.userName,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
      access_token: tokenData.access_token,
      sessionId: session._id.toString(),
    };
  }

  async logout(userId: string) {
    // Validate userId is provided
    if (!userId) {
      throw new BadRequestException('User ID is required for logout');
    }

    // Update the session table: mark session as logged_out and set logoutTimestamp
    const session = await this.sessionsService.logout(userId);

    if (!session) {
      throw new BadRequestException('No active session found for this user');
    }

    // Return proper response structure
    return {
      message: 'Logged out successfully',
      userId: userId,
      sessionId: session._id.toString(),
      logoutTimestamp: session.logoutTimestamp,
    };
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

  testing(testingDto: TestingDto) {
    console.log('Received TestingDto:', testingDto);

    try {
      const testData = JSON.stringify(testingDto);
      console.log('Testing DTO Data:', testData);
    } catch {
      console.error('Failed to stringify TestingDto');
    }
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
