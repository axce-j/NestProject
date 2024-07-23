/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
// import Users from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';
import Posts from './post.entity';
import { CreatePostDto } from './Dto/CreatePostDto';
import Users from 'src/users/entities/users.entity';
import { UpdatePostDto } from './Dto/UpdatePostDto';
// import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Posts)
    private postRepository: Repository<Posts>,
  ) {}

  getAllPosts() {
    return this.postRepository.find({ relations: ['author'] });
  }

  async getPostById(id: number) {

    const postDetails = await this.postRepository.find(
      {
        where: {id},
        relations:['author']
      }
    );
    if (postDetails){
        return  postDetails
    } else{
        throw new HttpException('post not found',HttpStatus.NOT_FOUND)
    }

  }

  async createPost(post: CreatePostDto, user: Users) {
    const newpost = await this.postRepository.create({
      ...post,
      author: user,
    });
    await this.postRepository.save(newpost);
    return newpost;
  }

  async updatePost( id: number, post: UpdatePostDto){
    await this.postRepository.update(id,post);
    const  updatePost= await this.postRepository.findOne({where:{id}, relations: ['author']})
    if (updatePost){
      return  updatePost
    }
    throw new HttpException("Post not found",HttpStatus.NOT_FOUND)
  }
}
