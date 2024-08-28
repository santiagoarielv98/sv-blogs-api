import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PublishArticleDto {
  @IsOptional()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsArray()
  tags: string[];
}
