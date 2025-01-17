import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/CreateCategoryDto';
import { JwtAuthenticationGuard } from 'src/authentication/jwtAuthenticationGuard';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async CreateCatgory(@Body() category: CreateCategoryDto) {
    return this.categoryService.createCategory(category);
  }
}
