import { Article } from 'src/articles/entities/article.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['article', 'tag'])
export class ArticleTag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Relaciones

  @ManyToOne(() => Article, (article) => article.tags, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  article: Article;

  @ManyToOne(() => Tag, (tag) => tag.articles, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  tag: Tag;
}
