import { Module } from '@nestjs/common';
// import { UsersController } from './users.controller';
// import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Users from './entities/users.entity';
import { Users23Service } from './users23.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  // controllers: [UsersController],
  providers: [Users23Service],
  exports: [Users23Service],
})
export class UsersModule {}
