import { AuthenticationService } from './authentication.service';
import { RegistrationDto } from 'src/users/dto/register-user.dto';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  SerializeOptions,
} from '@nestjs/common';
import { LocalAuthenticationGuard } from './localAuthenticationGuard';
import { Response } from 'express';
import { JwtAuthenticationGuard } from './jwtAuthenticationGuard';
import { RequestWithUser } from './requestWithUSer';
import { RegisterBiometricDto } from './dto/biometric.dto';
import { LoginDto } from './dto/login.dto';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register')
  async register(@Body() registerData: RegistrationDto) {
    return this.authenticationService.registerUser(registerData);
  }
  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard) // This should use the updated logic in your guard
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('log-in')
  async logIn(
    @Body()
    payload: LoginDto,
    @Req() request: any,
  ) {
    const { user } = request;

    // Generate JWT token after successful login
    const cookie = this.authenticationService.getCookieWithJwtToken(
      user.id,
      user.role,
    );
    request.res.setHeader('Set-Cookie', cookie);

    // Return the user object (sensitive data like password can be excluded here)
    return user;
  }
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthenticationGuard)
  @Post('register-biometric')
  async registerBiometric(
    @Req() request: RequestWithUser,
    @Body() biometricData: RegisterBiometricDto,
  ) {
    const { user } = request;

    if (!user || user.role !== 'STUDENT') {
      throw new HttpException(
        'Only students are allowed to register biometric data',
        HttpStatus.FORBIDDEN,
      );
    }

    // Call the service to register biometric data
    return await this.authenticationService.registerBiometricData(
      user.id,
      biometricData,
    );
  }

  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('profile')
  @SerializeOptions({
    strategy: 'excludeAll',
  })
  authenticate(@Req() request: RequestWithUser) {
    const { user } = request;
    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }
    return user; // Alternatively, you can use `response.json(user)` if using @Res
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('log-out')
  async logOut(@Req() request: RequestWithUser, @Res() response: Response) {
    response.setHeader(
      'Set-Cookie',
      this.authenticationService.logoutByRemovingJwtToken(),
    );
    response.sendStatus(200);
  }
}
