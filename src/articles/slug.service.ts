import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import slugify from 'slugify';
@Injectable()
export class SlugService {
  constructor(
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,
  ) {}

  async generateUniqueSlug(title: string): Promise<string> {
    let slug = slugify(title, { lower: true });
    let count = 1;

    while (await this.articlesRepository.findOne({ where: { slug } })) {
      slug = slugify(`${title}-${count}`, { lower: true });
      count++;
    }

    return slug;
  }
}
