import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Posts from './post.entity';
import Category from 'src/category/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Posts, Category])],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
