import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as turf from '@turf/turf';
import { PolygonBasedClassPerimeter } from './polygonClassPerimeter.entity';
import { CreatePolygonBasedClassPerimeterDto } from './dto/polygonClassPerimeter.dto';

@Injectable()
export class PolygonBasedClassPerimeterService {
  constructor(
    @InjectRepository(PolygonBasedClassPerimeter)
    private PolygonBasedClassPerimeterRepository: Repository<PolygonBasedClassPerimeter>,
  ) {}

  async create(
    createPolygonBasedClassPerimeterDto: CreatePolygonBasedClassPerimeterDto,
  ): Promise<PolygonBasedClassPerimeter> {
    const { coordinates, shape, radius, altitudeRange, name } =
      createPolygonBasedClassPerimeterDto;

    const newPerimeter = this.PolygonBasedClassPerimeterRepository.create({
      name,
      coordinates,
      shape,
      radius,
      altitudeRange,
    });

    return this.PolygonBasedClassPerimeterRepository.save(newPerimeter);
  }

  async getAll(): Promise<PolygonBasedClassPerimeter[]> {
    return this.PolygonBasedClassPerimeterRepository.find();
  }

  async findById(id: number): Promise<PolygonBasedClassPerimeter> {
    return this.PolygonBasedClassPerimeterRepository.findOne({ where: { id } });
  }

  async isInsidePerimeter(
    perimeterId: number,
    pointCoordinates: string,
  ): Promise<boolean> {
    const perimeter = await this.findById(perimeterId);

    if (!perimeter) {
      throw new Error('Perimeter not found');
    }

    if (perimeter.shape === 'polygon') {
      const perimeterGeoJSON = JSON.parse(perimeter.coordinates);
      const point = turf.point(JSON.parse(pointCoordinates));

      const polygon = turf.polygon(perimeterGeoJSON.coordinates);
      return turf.booleanPointInPolygon(point, polygon);
    }

    // For circle-based logic
    if (perimeter.shape === 'circle') {
      const centerCoordinates = JSON.parse(perimeter.coordinates); // Convert string to JSON
      const pointCoordinatesParsed = JSON.parse(pointCoordinates); // Convert string to JSON

      if (!Array.isArray(centerCoordinates) || centerCoordinates.length < 2) {
        throw new Error('Invalid center coordinates format');
      }

      if (
        !Array.isArray(pointCoordinatesParsed) ||
        pointCoordinatesParsed.length < 2
      ) {
        throw new Error('Invalid point coordinates format');
      }

      const perimeterCenter = turf.point(centerCoordinates);
      const point = turf.point(pointCoordinatesParsed);

      const distance = turf.distance(perimeterCenter, point);
      return distance <= (perimeter.radius ?? 0);
    }

    return false;
  }
}
