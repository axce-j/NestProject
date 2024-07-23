import { TokenPayload } from './tokenPayload.interface';

import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Users23Service } from 'src/users/users23.service';
import { Inject } from '@nestjs/common';

export class Jwtstartegy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(Users23Service)
    private user23Service: Users23Service,
  ) {
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
      const item = await this.user23Service.findOne(payload.id);
      return item;
    } catch (error) {
      console.log(error);

      throw error;
    }
  }
}
