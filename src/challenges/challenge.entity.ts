// // src/challenges/challenge.entity.ts
// import { Users } from 'src/users/entities/users.entity';
// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   ManyToOne,
//   JoinColumn,
//   CreateDateColumn,
//   UpdateDateColumn,
// } from 'typeorm';

// @Entity('challenges')
// export class Challenge {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @ManyToOne(() => Users, { eager: true }) // Link to user (student)
//   @JoinColumn({ name: 'matriculationId' })
//   user: Users;

//   @Column()
//   challenge_token: string;

//   @CreateDateColumn()
//   created_at: Date;

//   @UpdateDateColumn()
//   updated_at: Date;

//   @Column({ type: 'timestamp' })
//   expiration_time: Date;

//   @Column({ default: false })
//   is_verified: boolean;
// }

import { Users } from 'src/users/entities/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('challenges')
export class Challenge {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, { eager: true }) // Link to user (student)
  @JoinColumn({ name: 'matriculationId' })
  user: Users;

  @Column()
  challenge_token: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'timestamp' })
  expiration_time: Date;

  @Column({ default: false })
  is_verified: boolean;
}
