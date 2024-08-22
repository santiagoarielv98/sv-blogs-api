import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { User } from 'src/users/decorators/user.decorator';
import { JwtPayload } from 'src/auth/auth.interface';

@Controller('api/articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createArticleDto: CreateArticleDto, @User() user: JwtPayload) {
    return this.articlesService.create(createArticleDto, user.sub);
  }

  @Get()
  findAll() {
    return this.articlesService.findAll();
  }

  @Get('all')
  findAll2() {
    return this.articlesService.findAll2();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articlesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
    @User() user: JwtPayload,
  ) {
    return this.articlesService.update(id, updateArticleDto, user.sub);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @User() user: JwtPayload) {
    return this.articlesService.remove(id, user.sub);
  }
}
