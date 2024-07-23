import { Expose } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsStrongPassword,
} from 'class-validator';

/* eslint-disable prettier/prettier */
export class RegistrationDto {
  @IsNotEmpty()
  @IsString()
  @Expose()
  name: string;
  
  @Expose()
  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;
}
