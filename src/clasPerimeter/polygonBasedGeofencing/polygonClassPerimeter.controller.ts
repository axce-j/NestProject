import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { PolygonBasedClassPerimeterService } from './polygonClassPerimeter.service';
import { CreatePolygonBasedClassPerimeterDto } from './dto/polygonClassPerimeter.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@Controller('class-perimeter')
@ApiTags('class-perimeter')

export class PolygonBasedClassPerimeterController {
  constructor(
    private readonly perimeterService: PolygonBasedClassPerimeterService,
  ) {}

  @Post('create')
  @ApiBody({ type: CreatePolygonBasedClassPerimeterDto })

  async create(@Body() createDto: CreatePolygonBasedClassPerimeterDto) {
    return this.perimeterService.create(createDto);
  }

  @Get()
  async getAll() {
    return this.perimeterService.getAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.perimeterService.findById(id);
  }

  // This endpoint is for development/testing purposes.
  // Validation of a student's location will be handled separately.
  @Post(':id/validate')
  async validate(
    @Param('id') id: number,
    @Body('coordinates') coordinates: number[],
  ) {
    const isInside = await this.perimeterService.isInsidePerimeter(
      id,
      coordinates,
    );
    return { valid: isInside };
  }
}
