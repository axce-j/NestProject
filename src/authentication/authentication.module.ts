import { UsersModule } from './../users/users.module';
import { localStrategy } from './local.strategy';
import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Jwtstartegy } from './jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}s`,
        },
      }),
    }),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, localStrategy, Jwtstartegy],
})
export class AuthenticationModule {}
