// // src/challenges/challenge.dto.ts
// import { IsString, IsNotEmpty } from 'class-validator';

// export class GenerateChallengeDto {
//   @IsString()
//   @IsNotEmpty()
//   user_id: number;
// }

// export class VerifyChallengeDto {
//   @IsString()
//   @IsNotEmpty()
//   challenge_token: string;

//   @IsString()
//   @IsNotEmpty()
//   biometric_response: string; // Response after biometric authentication (fingerprint/FaceID)
// }

import { IsString, IsNotEmpty } from 'class-validator';

export class GenerateChallengeDto {
  @IsString()
  @IsNotEmpty()
  matriculationId: string;
}

export class VerifyChallengeDto {
  @IsString()
  @IsNotEmpty()
  challenge_token: string;

  @IsString()
  @IsNotEmpty()
  biometric_response: string; // Signed challenge response from the biometric system
}
