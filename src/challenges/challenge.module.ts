// src/challenges/challenge.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChallengeService } from './challenge.service';
// import { ChallengeController } from './challenge.controller';
import { Challenge } from './challenge.entity';
import { Users } from '../users/entities/users.entity';
import { ChallengeController } from './challenge.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Challenge, Users])],
  providers: [ChallengeService],
  controllers: [ChallengeController],
})
export class ChallengeModule {}
