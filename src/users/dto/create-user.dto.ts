import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsStrongPassword,
  IsEnum,
} from 'class-validator';
import { Expose } from 'class-transformer';

// Define an Enum for roles
export enum Role {
  SUPERADMIN = 'SUPERADMIN',
  STUDENT = 'STUDENT',
  LECTURER = 'LECTURER',
}

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Expose()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  lastName: string;

  @IsEmail()
  @Expose()
  email: string;

  @IsStrongPassword()
  @Expose()
  password: string;

  @IsEnum(Role) // Ensure role is one of the allowed values
  @Expose()
  role: Role;
}
