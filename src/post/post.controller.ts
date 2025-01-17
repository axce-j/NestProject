import {
  // Body,
  ClassSerializerInterceptor,
  //   Body,
  Controller,
  Get,
  Param,
  // Post,
  // Req,
  SerializeOptions,
  // UseGuards,
  UseInterceptors,
  //   Delete,
  //   Get,
  //   Param,
  //   ParseIntPipe,
  //   Patch,
  //   Post,
  //   Query,
  //   UseGuards,
  //   ValidationPipe,
} from '@nestjs/common';
import { PostService } from './post.service';
// import { CreatePostDto } from './Dto/CreatePostDto';
// import { RequestWithUser } from 'src/authentication/requestWithUSer';
import FindOneParams from 'src/utils/FindOneParams';
// import { JwtAuthenticationGuard } from 'src/authentication/jwtAuthenticationGuard';

@Controller('Posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // @Get(':id')
  // @UseGuards(jwtAuthenticationGuard)
  // async getPostById(@Param() id:number ){

  //   return this.postService.getPostById(id)
  // }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  @SerializeOptions({
    strategy: 'excludeAll',
  })
  getAllPosts() {
    return this.postService.getAllPosts();
  }
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  @SerializeOptions({
    strategy: 'excludeAll',
  })
  getPostById(@Param() { id }: FindOneParams) {
    return this.postService.getPostById(Number(id));
  }

  // @UseInterceptors(ClassSerializerInterceptor)
  // @Post()
  // @SerializeOptions({
  //   strategy: 'excludeAll',
  // })
  // @UseGuards(JwtAuthenticationGuard)
  // async createPost(@Body() post: CreatePostDto, @Req() req: RequestWithUser) {
  //   // console.log(req.user);
  //   return this.postService.createPost(post, req.user);
  // }
}
