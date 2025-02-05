import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Users23Service } from '../users/users23.service';
import * as bcrypt from 'bcrypt';
import { RegistrationDto } from 'src/users/dto/register-user.dto';
import { TokenPayload } from './tokenPayload.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RequestWithUser } from './requestWithUSer';

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
  public async checkBiometricKey(
    user: RequestWithUser['user'],
  ): Promise<{ message: string }> {
    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    if (user.role !== 'STUDENT') {
      throw new HttpException(
        'Only students can have biometric data',
        HttpStatus.FORBIDDEN,
      );
    }

    if (!user.matriculationId) {
      throw new HttpException(
        'Matriculation ID is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Fetch student by matriculation ID
    const student = await this.user23Service.findOneByMatriculationId(
      user.matriculationId,
    );
    if (!student) {
      throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
    }

    // Check if biometric key is stored
    if (!student.biometricKey) {
      throw new HttpException(
        'Biometric data not registered',
        HttpStatus.NOT_FOUND,
      );
    }

    return { message: 'Biometric data found' };
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

  public getCookieWithJwtToken(
    id: number,
    role: string,
    matriculationId?: string,
    staffId?: string,
  ) {
    const payload: TokenPayload = { id, role, matriculationId, staffId };
    const token = this.jwtService.sign(payload);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_EXPIRATION_TIME')}`;
  }

  public logoutByRemovingJwtToken() {
    return `Authentication=; HttpOnly; Path=/; Age=0`;
  }

  /**
   * Validates a JWT token.
   * @param token The JWT token to validate.
   * @returns An object with isValid flag and, if valid, user details.
   */
  public async validateToken(token: string): Promise<{
    isValid: boolean;
    userId?: string;
    role?: string;
    email?: string;
    matriculationId?: string;
    staffId?: string;
  }> {
    try {
      // Verify token signature and expiration.
      const payload: TokenPayload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      console.log('Decoded JWT Payload:', payload);

      let user = null;

      // Fetch the user based on role
      if (payload.role === 'STUDENT' && payload.matriculationId) {
        user = await this.user23Service.findOneByMatriculationId(
          payload.matriculationId,
        );
      } else if (payload.role === 'LECTURER' && payload.staffId) {
        user = await this.user23Service.findOneByStaffId(payload.staffId);
      }

      // If user not found, return invalid
      if (!user) {
        return { isValid: false };
      }
      console.log('Fetched User:', user);

      return {
        isValid: true,
        userId: user.id.toString(), // Ensuring it's returned as a string
        role: user.role,
        email: user.email,
        matriculationId: user.matriculationId ?? undefined, // Return if exists
        staffId: user.staffId ?? undefined, // Return if exists
      };
    } catch (error) {
      return { isValid: false };
    }
  }
}
