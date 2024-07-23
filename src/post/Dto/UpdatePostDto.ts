import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdatePostDto {
  @IsNumber()
  @IsOptional()
  id: number;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title: string;
}
