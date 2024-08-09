import { IsString, IsNotEmpty } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  coverImageURL: string;

  @IsString()
  slug: string;

  @IsString()
  isPublished: boolean;

  @IsString()
  publishedAt: Date;
}
