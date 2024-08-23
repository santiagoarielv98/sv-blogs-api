import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  findOneBySlug(slug: string) {
    return this.postsRepository.findOne({ where: { slug } });
  }
  create(createPostDto: CreatePostDto, user: any) {
    const post = this.postsRepository.create(createPostDto);
    post.user = user;
    return this.postsRepository.save(post);
  }

  findAll() {
    return this.postsRepository.find();
  }
}
