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
import { ApiBody, ApiTags } from '@nestjs/swagger';

@Controller('authentication')
@ApiTags('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register')
  async register(@Body() registerData: RegistrationDto) {
    return this.authenticationService.registerUser(registerData);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('log-in')
  @ApiBody({ type: LoginDto })
  async logIn(@Body() payload: LoginDto, @Req() request: any) {
    const { user } = request;

    const cookie = this.authenticationService.getCookieWithJwtToken(
      user.id,
      user.role,
      user.matriculationId,
      user.staffId,
    );
    request.res.setHeader('Set-Cookie', cookie);

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
    return user;
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

  /** 🔹 NEW VALIDATE-TOKEN ENDPOINT **/
  @Post('validate-token')
  async validateToken(@Body() body: { token: string }) {
    if (!body.token) {
      throw new HttpException('Token is required', HttpStatus.BAD_REQUEST);
    }

    const validationResult = await this.authenticationService.validateToken(
      body.token,
    );

    if (!validationResult.isValid) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }

    return validationResult;
  }
}
