import { Article } from 'src/articles/entities/article.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['article', 'tag'])
export class ArticleTag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Relaciones

  @ManyToOne(() => Article, (article) => article.tags)
  article: Article;

  @ManyToOne(() => Tag, (tag) => tag.articles)
  tag: Tag;
}
