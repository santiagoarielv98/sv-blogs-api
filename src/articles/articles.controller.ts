import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { USERCREDENTIALS } from 'src/config/constants';
import { UsersService } from 'src/users/users.service';
import { ArticlesService } from './articles.service';
import { DraftArticleDto } from './dto/draft-article.dto';
import { PublishArticleDto } from './dto/publish-article.dto';
@Controller('api/articles')
export class ArticlesController {
  constructor(
    private readonly articlesService: ArticlesService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  async findAll() {
    return this.articlesService.findAll();
  }

  @Get(':slug')
  async findOneBySlug(@Param('slug') slug: string) {
    return this.articlesService.findOneBySlug(slug);
  }

  @Post('draft')
  async draft(@Body() draftArticleDto: DraftArticleDto) {
    const user = await this.usersService.findOneByUsername(
      USERCREDENTIALS.username,
    );
    return this.articlesService.draft(draftArticleDto, user);
  }

  @Post('publish')
  async createAndPublish(@Body() publishArticleDto: PublishArticleDto) {
    const user = await this.usersService.findOneByUsername(
      USERCREDENTIALS.username,
    );
    console.log(publishArticleDto);
    return this.articlesService.createAndPublish(publishArticleDto, user);
  }

  @Post('publish/:id')
  async publish(@Param('id') id: string) {
    const user = await this.usersService.findOneByUsername(
      USERCREDENTIALS.username,
    );
    return this.articlesService.publish(id, user);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() draftArticleDto: DraftArticleDto,
  ) {
    const user = await this.usersService.findOneByUsername(
      USERCREDENTIALS.username,
    );
    return this.articlesService.update(id, draftArticleDto, user);
  }
}
