import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { CreatePolygonBasedClassPerimeterDto } from './dto/polygonClassPerimeter.dto';
import { PolygonBasedClassPerimeterService } from './polygonClassPerimeter.service';

@Controller('class-perimeter')
export class PolygonBasedClassPerimeterController {
  constructor(
    private readonly PolygonBasedClassPerimeterService: PolygonBasedClassPerimeterService,
  ) {}

  @Post()
  async create(
    @Body()
    createPolygonBasedClassPerimeterDto: CreatePolygonBasedClassPerimeterDto,
  ) {
    return this.PolygonBasedClassPerimeterService.create(
      createPolygonBasedClassPerimeterDto,
    );
  }

  @Get()
  async getAll() {
    return this.PolygonBasedClassPerimeterService.getAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.PolygonBasedClassPerimeterService.findById(id);
  }

  @Post(':id/validate')
  async validate(
    @Param('id') id: number,
    @Body('coordinates') coordinates: string,
  ) {
    return this.PolygonBasedClassPerimeterService.isInsidePerimeter(
      id,
      coordinates,
    );
  }
}
