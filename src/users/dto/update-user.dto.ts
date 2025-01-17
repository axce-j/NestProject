import { PartialType } from '@nestjs/mapped-types';
import { RegistrationDto } from './register-user.dto';

export class UpdateUserDto extends PartialType(RegistrationDto) {}
