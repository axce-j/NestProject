import { AuthenticationService } from './authentication.service';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Users } from 'src/users/entities/users.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authenticationService: AuthenticationService) {
    super({
      usernameField: 'email', // This field can be adjusted to match your login field
    });
  }

  async validate(email: string, password: string): Promise<Users> {
    const user = await this.authenticationService.authenticateUser({
      email,
      password,
    });

    return user;
  }
}
