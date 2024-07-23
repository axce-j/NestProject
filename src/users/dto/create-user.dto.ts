import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsStrongPassword,
} from 'class-validator';

/* eslint-disable prettier/prettier */
export class CreateUserDto{

    @IsNotEmpty()
    @IsString()
    name:string;

    @IsEmail()
    email:string; 

     

    @IsStrongPassword()
    password:string;
}