import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum PerimeterShape {
  POLYGON = 'polygon',
  CIRCLE = 'circle',
  // Extend with additional shape types as needed.
}

@Entity()
export class PolygonBasedClassPerimeter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string; // Name of the class or session

  // Coordinates will be stored as structured JSON.
  // For a polygon, this could be an array of coordinate pairs:
  // e.g., [[lng1, lat1], [lng2, lat2], [lng3, lat3], ...]
  // For a circle, you might store the center coordinate: [lng, lat]
  @Column('simple-json')
  coordinates: number[] | number[][];

  @Column({ type: 'enum', enum: PerimeterShape })
  shape: PerimeterShape;

  // Optional for circles: the radius in kilometers or meters (as you define).
  @Column('float', { nullable: true })
  radius?: number;

  // Optional altitude range (if needed for 3D geofencing)
  @Column('float', { nullable: true })
  altitudeRange?: number;
}
