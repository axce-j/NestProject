// src/challenges/challenge.service.ts
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Challenge } from './challenge.entity';
import { Users } from 'src/users/entities/users.entity';
import { GenerateChallengeDto, VerifyChallengeDto } from './challenge.dto';

@Injectable()
export class ChallengeService {
  private readonly logger = new Logger(ChallengeService.name);

  constructor(
    @InjectRepository(Challenge)
    private challengeRepository: Repository<Challenge>,
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {}

  // Generate the challenge and store it in the DB
  async generateChallenge(dto: GenerateChallengeDto): Promise<string> {
    const { user_id } = dto;

    try {
      const user = await this.userRepository.findOne({
        where: { id: user_id },
      });

      // Ensure only students can generate challenges
      if (!user || user.role !== 'STUDENT') {
        throw new NotFoundException('Student not found or incorrect role.');
      }

      const challenge = this.createChallengeToken();
      const expirationTime = new Date();
      expirationTime.setMinutes(expirationTime.getMinutes() + 10); // Challenge expires in 10 minutes

      const newChallenge = this.challengeRepository.create({
        user: user,
        challenge_token: challenge,
        expiration_time: expirationTime,
      });

      await this.challengeRepository.save(newChallenge);
      this.logger.log(`Challenge generated for user_id ${user_id}`);

      return challenge;
    } catch (error) {
      this.logger.error('Error generating challenge:', error.message);
      throw new InternalServerErrorException('Failed to generate challenge.');
    }
  }

  // Generate a random challenge token
  private createChallengeToken(): string {
    return Math.random().toString(36).substring(2, 15); // Example: random alphanumeric string
  }

  // Verify the challenge with the biometric response
  async verifyChallenge(dto: VerifyChallengeDto): Promise<boolean> {
    const { challenge_token, biometric_response } = dto;

    try {
      // Find the challenge by token
      const challenge = await this.challengeRepository.findOne({
        where: { challenge_token },
        relations: ['user'],
      });

      if (!challenge) {
        throw new NotFoundException('Challenge not found.');
      }

      // Check if the challenge has expired
      if (new Date() > new Date(challenge.expiration_time)) {
        throw new Error('Challenge expired');
      }

      // Verify biometric response (example logic, needs real implementation)
      const biometricValid = await this.verifyBiometricResponse(
        biometric_response,
        challenge.user,
      );

      if (biometricValid) {
        challenge.is_verified = true;
        await this.challengeRepository.save(challenge);
        this.logger.log(`Challenge ${challenge_token} verified successfully`);
        return true;
      }

      return false;
    } catch (error) {
      this.logger.error('Error verifying challenge:', error.message);
      throw new InternalServerErrorException('Failed to verify challenge.');
    }
  }

  // Verify biometric response (example, replace with actual verification logic)
  private async verifyBiometricResponse(
    response: string,
    user: Users,
  ): Promise<boolean> {
    // Dummy verification (compare with stored biometric key for user)
    return response === user.biometricKey;
  }
}
