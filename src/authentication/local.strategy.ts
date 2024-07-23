import { AuthenticationService } from './authentication.service';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import Users from 'src/users/entities/users.entity';

@Injectable()
export class localStrategy extends PassportStrategy(Strategy) {
  constructor(private authenticationService: AuthenticationService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<Users> {
    console.log('hell', email);

    return this.authenticationService.authenticatePassword(email, password);
  }
}
