// // src/challenges/challenge.controller.ts
// import { Controller, Post, Body, Logger } from '@nestjs/common';
// import { ChallengeService } from './challenge.service';
// import { GenerateChallengeDto, VerifyChallengeDto } from './challenge.dto';
// import { ApiTags, ApiOperation } from '@nestjs/swagger';

// @ApiTags('Challenges')
// @Controller('challenges')
// export class ChallengeController {
//   private readonly logger = new Logger(ChallengeController.name);

//   constructor(private readonly challengeService: ChallengeService) {}

//   // Endpoint to generate a challenge
//   @Post('generate')
//   @ApiOperation({
//     summary: 'Generate a challenge for biometric authentication',
//   })
//   async generateChallenge(
//     @Body() generateChallengeDto: GenerateChallengeDto,
//   ): Promise<string> {
//     return this.challengeService.generateChallenge(generateChallengeDto);
//   }

//   // Endpoint to verify a challenge
//   @Post('verify')
//   @ApiOperation({ summary: 'Verify a challenge with biometric response' })
//   async verifyChallenge(
//     @Body() verifyChallengeDto: VerifyChallengeDto,
//   ): Promise<boolean> {
//     return this.challengeService.verifyChallenge(verifyChallengeDto);
//   }
// }

import { Controller, Post, Body, Logger } from '@nestjs/common';
import { ChallengeService } from './challenge.service';
import { GenerateChallengeDto, VerifyChallengeDto } from './challenge.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Challenges')
@Controller('challenges')
export class ChallengeController {
  private readonly logger = new Logger(ChallengeController.name);

  constructor(private readonly challengeService: ChallengeService) {}

  @Post('generate')
  @ApiOperation({
    summary: 'Generate a challenge for biometric authentication',
  })
  async generateChallenge(
    @Body() generateChallengeDto: GenerateChallengeDto,
  ): Promise<string> {
    return this.challengeService.generateChallenge(generateChallengeDto);
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify a challenge with biometric response' })
  async verifyChallenge(
    @Body() verifyChallengeDto: VerifyChallengeDto,
  ): Promise<boolean> {
    return this.challengeService.verifyChallenge(verifyChallengeDto);
  }
}
