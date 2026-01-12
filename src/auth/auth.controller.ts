import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupAuthDto } from './dto/signup-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LogoutAuthDto } from './dto/logout-auth.dto';
import { TestingDto } from './dto/testing.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  signup(@Body() signupAuthDto: SignupAuthDto) {
    return this.authService.signup(signupAuthDto);
  }

  @Post('authenticate')
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Request() req, @Body() logoutAuthDto: LogoutAuthDto = {}) {
    console.log('In AuthController - logout endpoint');
    console.log('Request user:', req.user);
    console.log('Logout DTO:', logoutAuthDto);

    let userId = logoutAuthDto?.userId;

    if (!userId) {
      userId = req.user?.sub;
      if (!userId) {
        throw new BadRequestException('User ID not found in token');
      }
    }

    console.log('Logging out user with ID:', userId);

    return this.authService.logout(userId);
  }

  @Post('forgot-password')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.identifier);
  }

  @Post('testing')
  testing(@Body() testingDto: TestingDto) {
    console.log('In AuthController - testing endpoint');
    try {
      console.log('Inside AuthController testing method', testingDto);
      return this.authService.testing(testingDto);
    } catch (error) {
      console.error('Error in AuthController testing method:', error);
      throw error;
    }
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
