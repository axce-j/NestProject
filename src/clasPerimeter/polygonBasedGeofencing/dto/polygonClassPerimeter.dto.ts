import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreatePolygonBasedClassPerimeterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  coordinates: string; // GeoJSON format

  @IsString()
  @IsNotEmpty()
  shape: string;

  @IsOptional()
  @IsNumber()
  radius?: number;

  @IsOptional()
  @IsNumber()
  altitudeRange?: number;
}
