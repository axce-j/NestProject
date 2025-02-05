import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class PolygonBasedClassPerimeter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string; // Name of the class or session

  @Column('text')
  coordinates: string; // Store coordinates as GeoJSON or WKT

  @Column({ type: 'varchar', length: 50 })
  shape: string; // Shape of the class (e.g., 'polygon', 'circle')

  @Column('float', { nullable: true })
  radius?: number; // Optional radius (for circular geofence)

  @Column('float', { nullable: true })
  altitudeRange?: number; // Optional altitude for 3D geofencing
}
