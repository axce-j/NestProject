import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsArray,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PerimeterShape } from '../polygonClassPerimeter.entity';

export class CreatePolygonBasedClassPerimeterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  // For polygon shapes, expect an array of coordinate pairs (each pair is an array of numbers).
  // For circle shapes, you can expect a single coordinate pair (array of two numbers).
  @IsNotEmpty()
  // We'll allow either a single coordinate pair or an array of them.
  coordinates: number[] | number[][];

  @IsEnum(PerimeterShape)
  shape: PerimeterShape;

  @IsOptional()
  @IsNumber()
  radius?: number; // For circle

  @IsOptional()
  @IsNumber()
  altitudeRange?: number;
}
