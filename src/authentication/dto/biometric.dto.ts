import { IsOptional, IsString } from 'class-validator';

export class RegisterBiometricDto {
  @IsOptional()
  @IsString()
  faceId?: string;

  @IsOptional()
  @IsString()
  fingerprintId?: string;
}
