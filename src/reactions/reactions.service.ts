import { Injectable } from '@nestjs/common';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { UpdateReactionDto } from './dto/update-reaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reaction } from './entities/reaction.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReactionsService {
  constructor(
    @InjectRepository(Reaction)
    private reactionRepository: Repository<Reaction>,
  ) {}

  create(createReactionDto: CreateReactionDto) {
    return 'This action adds a new reaction';
  }

  findAll() {
    return `This action returns all reactions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reaction`;
  }

  update(id: number, updateReactionDto: UpdateReactionDto) {
    return `This action updates a #${id} reaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} reaction`;
  }

  // obtener las reacciones de varios articulos
  async getReactionsByArticles(articlesIds: string[]) {
    return await this.reactionRepository
      .createQueryBuilder('reaction')
      .where('reaction.articleId IN (:...articlesIds)', { articlesIds })
      .leftJoinAndSelect('reaction.user', 'user')
      .select([
        'reaction.id',
        'reaction.type',
        'reaction.articleId',
        'user.id',
        'user.username',
        'user.profile_picture',
      ])
      .getMany();
  }
}
