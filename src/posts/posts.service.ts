import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { CreatePostDto } from './dto/create-post.dto';
import { Post } from './entities/post.entity';
import slugify from 'slugify';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    private usersService: UsersService,
  ) {}

  findOneBySlug(slug: string) {
    return this.postsRepository.findOne({
      where: { slug },
      relations: ['user'],
    });
  }
  async create(createPostDto: CreatePostDto, user: string) {
    const userEntity = await this.usersService.findOneById(user);

    if (!userEntity) {
      throw new Error('User not found');
    }
    const post = this.postsRepository.create(createPostDto);

    const slug = await this.uniqueSlug(post.title);

    post.slug = slug;
    post.user = userEntity;

    return this.postsRepository.save(post);
  }

  findAll() {
    return this.postsRepository.find();
  }

  delete(id: string, userId: string) {
    return this.postsRepository.delete({
      id,
      user: {
        id: userId,
      },
    });
  }

  uniqueSlug = async (title: string) => {
    let slug = slugify(title, { lower: true });
    let counter = 1;

    while (await this.findOneBySlug(slug)) {
      slug = slugify(`${title}-${counter}`, { lower: true });
      counter++;
    }

    return slug;
  };
}
