import { IsNotEmpty, IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PerimeterShape } from '../polygonClassPerimeter.entity';

class GeoJsonPolygon {
  type: 'Polygon';
  coordinates: number[][][];
}

export class CreatePolygonBasedClassPerimeterDto {
  @IsNotEmpty()
  name: string;

  @ValidateNested()
  @Type(() => GeoJsonPolygon)
  coordinates: GeoJsonPolygon;

  @IsEnum(PerimeterShape)
  shape: PerimeterShape;

  @IsOptional()
  radius?: number;

  @IsOptional()
  altitudeRange?: number;
}
