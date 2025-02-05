import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum PerimeterShape {
  POLYGON = 'polygon',
  CIRCLE = 'circle',
}

@Entity()
export class PolygonBasedClassPerimeter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string; // Name of the class or session

  // Store as a full GeoJSON object
  @Column('simple-json')
  coordinates: { type: 'Polygon'; coordinates: number[][][] };

  @Column({ type: 'enum', enum: PerimeterShape })
  shape: PerimeterShape;

  @Column('float', { nullable: true })
  radius?: number;

  @Column('float', { nullable: true })
  altitudeRange?: number;
}
