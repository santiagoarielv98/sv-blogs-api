import { Body, Controller, Param, Post } from '@nestjs/common';
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
    return this.articlesService.createAndPublish(publishArticleDto, user);
  }

  // publicar un articulo ya creado
  @Post('publish/:id')
  async publish(@Param('id') id: string) {
    const user = await this.usersService.findOneByUsername(
      USERCREDENTIALS.username,
    );
    return this.articlesService.publish(id, user);
  }
}
