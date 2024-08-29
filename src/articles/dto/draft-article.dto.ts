import { IsOptional, IsString } from 'class-validator';

export class DraftArticleDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  content: string;
}
