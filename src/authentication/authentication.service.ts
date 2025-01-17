import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Users23Service } from '../users/users23.service';
// import { string } from "joi";
import * as bcrypt from 'bcrypt';
import { error } from 'console';
import { RegistrationDto } from 'src/users/dto/register-user.dto';
import { TokenPayload } from './tokenPayload.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly user23Service: Users23Service,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async registerUser(registerdto: RegistrationDto) {
    try {
      const hashedpassword = await bcrypt.hash(registerdto.password, 10);

      const createdUser = await this.user23Service.create({
        ...registerdto,
        password: hashedpassword,
      });

      return createdUser;
    } catch (error) {
      console.error('Error in AuthenticationService.registerUser:', error);
      throw new HttpException(
        'Registration failed. Please try again later. ',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async authenticatePassword(email: string, plaintextPassword: string) {
    const user = await this.user23Service.getByEmail(email);

    try {
      this.verifyPassword(plaintextPassword, user.password);
      // user.password = undefined;
      // console.log(user, email);
      return user;
    } catch (error) {
      throw new error('something went wrong with my server');
    }
  }
  async verifyPassword(plaintextPassword: string, hashedPassword: string) {
    const IsPasswordMatching = await bcrypt.compare(
      plaintextPassword,
      hashedPassword,
    );
    if (!IsPasswordMatching) {
      throw new error('error wrong credentials used');
    }
  }

  public gatCookieWithJwtToken(id: number) {
    const payload: TokenPayload = { id };
    const token = this.jwtService.sign(payload);
    return `Authentication=${token};HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_EXPIRATION_TIME')}`;
  }

  public logoutByRemovingJwtToken() {
    return `Authentication=; HttpOnly; Path=/; Age=0`;
  }
}
