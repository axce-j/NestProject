import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Users23Service } from 'src/users/users23.service';
import { Request } from 'express';
import { TokenPayload } from './tokenPayload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(Users23Service) private user23Service: Users23Service) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authentication;
        },
      ]),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: TokenPayload) {
    try {
      const user = await this.user23Service.findOne(payload.id);
      return user;
    } catch (error) {
      console.log(error);
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }
  }
}
