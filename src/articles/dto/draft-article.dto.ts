import { IsArray, IsOptional, IsString } from 'class-validator';

export class DraftArticleDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  content: string;

  @IsOptional()
  @IsArray()
  tags: string[];
}
