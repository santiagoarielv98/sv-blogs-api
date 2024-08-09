import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,
    // @InjectRepository(User)
    // private usersRepository: Repository<User>,
  ) {}

  create(createArticleDto: CreateArticleDto, userId: string) {
    return this.articlesRepository.save({
      ...createArticleDto,
      user: { id: userId },
    });
  }

  findAll() {
    return this.articlesRepository.find();
  }

  findOne(id: string) {
    return this.articlesRepository.findOne({ where: { id } });
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    return `This action updates a #${id} article`;
  }

  remove(id: number) {
    return `This action removes a #${id} article`;
  }
}
