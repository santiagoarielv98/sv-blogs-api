import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { DraftArticleDto } from './dto/draft-article.dto';
@Controller('api/articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  async findAll() {
    // return this.articlesService.findAll();
    return this.articlesService.findAll2();
  }

  @Get(':slug')
  async findOneBySlug(@Param('slug') slug: string) {
    return this.articlesService.findOneBySlug(slug);
  }

  @Post('draft')
  async draft(@Body() draftArticleDto: DraftArticleDto) {
    return this.articlesService.draft(draftArticleDto);
  }
}
