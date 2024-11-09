import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
export class CreatePostDto {
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

  @IsNumber()
  catgeories: number;
}
