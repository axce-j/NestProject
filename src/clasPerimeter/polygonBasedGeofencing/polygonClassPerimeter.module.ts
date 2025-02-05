import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PolygonBasedClassPerimeter } from './polygonClassPerimeter.entity';
import { PolygonBasedClassPerimeterService } from './polygonClassPerimeter.service';
import { PolygonBasedClassPerimeterController } from './polygonClassPerimeter.controller';
// import { PolygonBasedClassPerimeter } from './class-perimeter.entity';
// import { PolygonBasedClassPerimeterService } from './class-perimeter.service';
// import { PolygonBasedClassPerimeterController } from './class-perimeter.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PolygonBasedClassPerimeter])],
  providers: [PolygonBasedClassPerimeterService],
  controllers: [PolygonBasedClassPerimeterController],
})
export class PolygonBasedClassPerimeterModule {}
