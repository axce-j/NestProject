import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Address from 'src/users/entities/address.entity';
import Posts from 'src/post/post.entity';
import Category from 'src/category/category.entity';
import { Users } from 'src/users/entities/users.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities: [
          __dirname + '/../**/*.entity.ts',
          Users,
          Address,
          Posts,
          Category,
        ],
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
