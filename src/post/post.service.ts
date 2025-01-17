import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Posts from './post.entity';
// import { CreatePostDto } from './Dto/CreatePostDto';
// import Users from 'src/users/entities/users.entity';
import { UpdatePostDto } from './Dto/UpdatePostDto';
import Category from 'src/category/category.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Posts)
    private postRepository: Repository<Posts>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  getAllPosts() {
    return this.postRepository.find({ relations: ['author', 'categories'] });
  }

  async getPostById(id: number) {
    const postDetails = await this.postRepository.find({
      where: { id },
      relations: ['author', 'categories'],
    });
    if (postDetails) {
      return postDetails;
    } else {
      throw new HttpException('post not found', HttpStatus.NOT_FOUND);
    }
  }

  // async createPost(post: CreatePostDto, user: Users) {
  //   const category = await this.categoryRepository.find({
  //     where: { id: post.catgeories}
  //   });
  //   console.log(category)
  //   const newpost = await this.postRepository.create({
  //     ...post,
  //     author: user,
  //     categories: category,
  //   });
  //   await this.postRepository.save(newpost);
  //   return newpost;
  // }

  async updatePost(id: number, post: UpdatePostDto) {
    await this.postRepository.update(id, post);
    const updatePost = await this.postRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (updatePost) {
      return updatePost;
    }
    throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }
}
