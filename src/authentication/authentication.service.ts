import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Users23Service } from '../users/users23.service';
import * as bcrypt from 'bcrypt';
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

  // Normal user registration
  public async registerUser(registerDto: RegistrationDto) {
    try {
      const hashedPassword = await bcrypt.hash(registerDto.password, 10);
      const role = registerDto.role;

      const createdUser = await this.user23Service.create({
        ...registerDto,
        password: hashedPassword,
        role: role,
      });

      return createdUser;
    } catch (error) {
      console.error('Error in AuthenticationService.registerUser:', error);
      throw new HttpException(
        'Registration failed. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async registerBiometricData(
    userId: number,
    biometricData: {
      faceId?: string;
      fingerprintId?: string;
      biometricKey?: string;
    },
  ) {
    // Check if the user exists and has the role of STUDENT
    const user = await this.user23Service.findOne(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (user.role !== 'STUDENT') {
      throw new HttpException(
        'Biometric registration is only available for students',
        HttpStatus.FORBIDDEN,
      );
    }

    // Validate biometric data
    if (!biometricData.faceId && !biometricData.fingerprintId) {
      throw new HttpException(
        'At least one biometric data (face ID or fingerprint ID) must be provided',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Update the user with the provided biometric data and public key
    const updatedUser = await this.user23Service.updateUser(userId, {
      faceId: biometricData.faceId || null,
      fingerprintId: biometricData.fingerprintId || null,
      biometricKey: biometricData.biometricKey || null, // Storing the public key
    });

    return updatedUser;
  }

  // User authentication
  public async authenticateUser(loginDto: {
    matriculationId?: string;
    schoolId?: string;
    staffId?: string;
    email?: string;
    password: string;
  }) {
    let user = null;

    if (loginDto.matriculationId) {
      user = await this.user23Service.findOneByMatriculationId(
        loginDto.matriculationId,
      );
    }

    if (!user && loginDto.staffId) {
      user = await this.user23Service.findOneByStaffId(loginDto.staffId);
    }

    if (!user && loginDto.email) {
      user = await this.user23Service.getByEmail(loginDto.email);
    }

    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    try {
      await this.verifyPassword(loginDto.password, user.password);
      return user;
    } catch (error) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
  }

  private async verifyPassword(
    plaintextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plaintextPassword,
      hashedPassword,
    );
    if (!isPasswordMatching) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
  }

  public getCookieWithJwtToken(id: number, role: string) {
    const payload: TokenPayload = { id, role };
    const token = this.jwtService.sign(payload);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_EXPIRATION_TIME')}`;
  }

  public logoutByRemovingJwtToken() {
    return `Authentication=; HttpOnly; Path=/; Age=0`;
  }
}
