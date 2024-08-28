import { ArticleTag } from 'src/article-tags/entities/article-tag.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ unique: true, nullable: false })
  name: string;

  @OneToMany(() => ArticleTag, (article_tag) => article_tag.tag)
  articles: ArticleTag[];
}
