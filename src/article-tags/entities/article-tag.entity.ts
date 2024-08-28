import { Article } from 'src/articles/entities/article.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { Entity, ManyToOne } from 'typeorm';

@Entity()
export class ArticleTag {
  @ManyToOne(() => Article, (article) => article.tags)
  article: Article;

  @ManyToOne(() => Tag, (tag) => tag.articles)
  tag: Tag;
}
