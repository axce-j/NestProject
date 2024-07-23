import { Test, TestingModule } from '@nestjs/testing';
import { Category } from './category';

describe('Category', () => {
  let provider: Category;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Category],
    }).compile();

    provider = module.get<Category>(Category);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
