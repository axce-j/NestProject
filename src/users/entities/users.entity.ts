// import { Exclude, Expose } from 'class-transformer';
// import {
//   Column,
//   CreateDateColumn,
//   Entity,
//   PrimaryGeneratedColumn,
// } from 'typeorm';

// @Entity()
// export class Users {
//   @PrimaryGeneratedColumn()
//   @Expose()
//   public id: number;

//   @Column('varchar')
//   @Expose()
//   public firstName: string;

//   @Column('varchar')
//   @Expose()
//   public lastName: string;

//   @Column({ unique: true })
//   @Expose()
//   public email: string;

//   @Column({ nullable: true })
//   @Expose()
//   public institutionalEmail?: string;

//   @Column()
//   @Exclude()
//   public password: string;

//   @Column({ nullable: true })
//   @unique
//   @Expose()
//   public matriculationId?: string; // For STUDENT role

//   @Column({ nullable: true })
//   @unique
//   @Expose()
//   public staffId?: string; // For LECTURER role

//   @Column({ nullable: true })
//   @Expose()
//   public biometricKey?: string; // For STUDENT role (Fingerprint or Face ID)

//   @Column('varchar', { nullable: true })
//   @Expose()
//   public city?: string;

//   @Column('varchar', { nullable: true })
//   @Expose()
//   public tel?: string;

//   @CreateDateColumn()
//   public createdAt: Date;

//   @Column({ nullable: true })
//   @Expose()
//   public faceId?: string;

//   @Column({ nullable: true })
//   @Expose()
//   public fingerprintId?: string;

//   // You may need a role column to distinguish between SUPERADMIN, STUDENT, and LECTURER
//   @Column({
//     type: 'enum',
//     enum: ['SUPERADMIN', 'STUDENT', 'LECTURER'],
//     default: 'STUDENT',
//   })
//   @Expose()
//   public role: 'SUPERADMIN' | 'STUDENT' | 'LECTURER';
// }

import { Exclude, Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['email']) // Email must be unique
@Unique(['institutionalEmail']) // Prevents duplicate lecturer registrations
@Unique(['matriculationId']) // Prevents duplicate student registrations
@Unique(['staffId']) // Prevents duplicate lecturer registrations
export class Users {
  @PrimaryGeneratedColumn()
  @Expose()
  public id: number;

  @Column('varchar')
  @Expose()
  public firstName: string;

  @Column('varchar')
  @Expose()
  public lastName: string;

  @Column({ unique: true }) // Ensure email is unique
  @Expose()
  public email: string;

  @Column({ nullable: true })
  @Expose()
  public institutionalEmail?: string;

  @Column()
  @Exclude()
  public password: string;

  @Column({ nullable: true, unique: true }) // Ensure matriculationId is unique
  @Expose()
  public matriculationId?: string; // For STUDENT role

  @Column({ nullable: true, unique: true }) // Ensure staffId is unique
  @Expose()
  public staffId?: string; // For LECTURER role

  @Column({ nullable: true })
  @Expose()
  public biometricKey?: string; // For STUDENT role (Fingerprint or Face ID)

  @Column('varchar', { nullable: true })
  @Expose()
  public city?: string;

  @Column('varchar', { nullable: true })
  @Expose()
  public tel?: string;

  @CreateDateColumn()
  public createdAt: Date;

  @Column({ nullable: true })
  @Expose()
  public faceId?: string;

  @Column({ nullable: true })
  @Expose()
  public fingerprintId?: string;

  @Column({
    type: 'enum',
    enum: ['SUPERADMIN', 'STUDENT', 'LECTURER'],
    default: 'STUDENT',
  })
  @Expose()
  public role: 'SUPERADMIN' | 'STUDENT' | 'LECTURER';
}
