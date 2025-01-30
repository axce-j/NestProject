import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Address from 'src/users/entities/address.entity';
import Posts from 'src/post/post.entity';
import Category from 'src/category/category.entity';
import { Users } from 'src/users/entities/users.entity';
import { Challenge } from 'src/challenges/challenge.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        // host: configService.get('POSTGRES_HOST'),
        // username: configService.get('POSTGRES_USER'),
        // password: configService.get('POSTGRES_PASSWORD'),
        // database: configService.get('POSTGRES_DB'),
        url: configService.get('RENDER_URL'),
        entities: [
          __dirname + '/../**/*.entity.ts',
          Users,
          Address,
          Posts,
          Category,
          Challenge,
        ],
        synchronize: true,
        ssl: {
          rejectUnauthorized: false, // Use this to allow self-signed certificates (if needed)
        },
      }),
    }),
  ],
})
export class DatabaseModule {}
