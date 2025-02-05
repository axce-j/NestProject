import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as turf from '@turf/turf';
import { PolygonBasedClassPerimeter, PerimeterShape } from './polygonClassPerimeter.entity';
import { CreatePolygonBasedClassPerimeterDto } from './dto/polygonClassPerimeter.dto';
 
@Injectable()
export class PolygonBasedClassPerimeterService {
  constructor(
    @InjectRepository(PolygonBasedClassPerimeter)
    private readonly perimeterRepository: Repository<PolygonBasedClassPerimeter>,
  ) {}

  async create(
    createDto: CreatePolygonBasedClassPerimeterDto,
  ): Promise<PolygonBasedClassPerimeter> {
    // Optionally, add additional validation here (e.g., ensure at least 3 points if polygon)
    const newPerimeter = this.perimeterRepository.create(createDto);
    return this.perimeterRepository.save(newPerimeter);
  }

  async getAll(): Promise<PolygonBasedClassPerimeter[]> {
    return this.perimeterRepository.find();
  }

  async findById(id: number): Promise<PolygonBasedClassPerimeter> {
    const perimeter = await this.perimeterRepository.findOne({ where: { id } });
    if (!perimeter) {
      throw new HttpException('Perimeter not found', HttpStatus.NOT_FOUND);
    }
    return perimeter;
  }

  /**
   * Example function for checking if a given point is inside a polygon perimeter.
   * (This may be used for student validation in a separate module.)
   */
  async isInsidePerimeter(
    perimeterId: number,
    pointCoordinates: number[], // expecting [lng, lat]
  ): Promise<boolean> {
    const perimeter = await this.findById(perimeterId);

    if (perimeter.shape === PerimeterShape.POLYGON) {
      // Here we assume that `perimeter.coordinates` is stored as a GeoJSON polygon:
      // For example: { "type": "Polygon", "coordinates": [[[lng, lat], [lng, lat], ...]] }
      // Or, if you store just the array of points, convert to polygon format:
      let polygon;
      try {
        if (Array.isArray(perimeter.coordinates[0])) {
          // Assume it's an array of coordinate pairs
          polygon = turf.polygon([perimeter.coordinates as number[][]]);
        } else {
          // Otherwise, expect it to be a complete GeoJSON object stored as JSON string (if needed)
          polygon = turf.polygon((perimeter.coordinates as any).coordinates);
        }
      } catch (e) {
        throw new HttpException('Invalid perimeter coordinates format', HttpStatus.BAD_REQUEST);
      }
      const point = turf.point(pointCoordinates);
      return turf.booleanPointInPolygon(point, polygon);
    }

    if (perimeter.shape === PerimeterShape.CIRCLE) {
      // For a circle, `perimeter.coordinates` should be stored as a single coordinate pair [lng, lat]
      const center = turf.point(perimeter.coordinates as number[]);
      const point = turf.point(pointCoordinates);
      const distance = turf.distance(center, point);
      return distance <= (perimeter.radius ?? 0);
    }

    throw new HttpException('Unsupported shape type', HttpStatus.BAD_REQUEST);
  }
}
