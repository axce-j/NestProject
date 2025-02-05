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
    
      if (!perimeter) {
        throw new HttpException('Perimeter not found', HttpStatus.NOT_FOUND);
      }
    
      if (perimeter.shape === PerimeterShape.POLYGON) {
        const geojson = perimeter.coordinates as { type: 'Polygon'; coordinates: number[][][] };
        const polygon = turf.polygon(geojson.coordinates); // Use geojson.coordinates directly
        const point = turf.point(pointCoordinates);
        return turf.booleanPointInPolygon(point, polygon);
      }
    
      if (perimeter.shape === PerimeterShape.CIRCLE) {
        // Extract coordinates for the center:
        const centerCoordinates = perimeter.coordinates.coordinates[0][0]; // Access the first point of the polygon for the center
        const center = turf.point(centerCoordinates);  // Use the extracted coordinates
        const point = turf.point(pointCoordinates);
        const distance = turf.distance(center, point);
        return distance <= (perimeter.radius ?? 0);
      }
    
      throw new HttpException('Unsupported shape type', HttpStatus.BAD_REQUEST);
    }
    
    
  }
