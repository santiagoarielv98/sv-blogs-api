import {
  IsArray,
  IsDefined,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class PublishArticleDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  @IsDefined()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsArray()
  tags: string[];
}
