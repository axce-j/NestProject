import { AuthenticationService } from './authentication.service';
import { RegistrationDto } from 'src/users/dto/register-user.dto';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LocalAuthenticationGuard } from './localAuthenticationGuard';
import { RequestWithUser } from './requestWithUSer';
import { Response } from 'express';
import { jwtAuthenticationGuard } from './jwtAuthenticationGuard';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationservice: AuthenticationService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register')
  async register(@Body() registerData: RegistrationDto) {
    return this.authenticationservice.registerUser(registerData);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('log-in')
  @SerializeOptions({
    strategy: 'excludeAll',
  })
  async logIn(@Req() request: RequestWithUser) {
    const { user } = request;
    const cookie = this.authenticationservice.gatCookieWithJwtToken(user.id);
    request.res.setHeader('Set-Cookie', cookie);
    // user.password = undefined;
    return user;
  }

  @UseGuards(jwtAuthenticationGuard)
  @Get()
  authentictae(@Res() request: RequestWithUser) {
    const { user } = request;
    // user.password = undefined;
    return user;
  }

  @UseGuards(jwtAuthenticationGuard)
  @Post('log-out')
  async logOut(@Req() request: RequestWithUser, @Res() response: Response) {
    response.setHeader(
      'Set-Cookie',
      this.authenticationservice.logoutByRemovingJwtToken(),
    );
    response.sendStatus(200);
  }
}
