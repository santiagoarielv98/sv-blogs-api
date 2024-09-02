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
  async getReactionsByArticlesIds(articlesIds: string[]) {
    return await this.reactionRepository
      .createQueryBuilder('reaction')
      .select('reaction.articleId', 'articleId')
      .addSelect('reaction.type', 'type')
      .addSelect('COUNT(reaction.id)', 'count')
      .where('reaction.articleId IN (:...articlesIds)', { articlesIds })
      .groupBy('reaction.articleId, reaction.type')
      .orderBy('reaction.articleId, COUNT(reaction.id)', 'DESC')
      .getRawMany();
  }

  async getReactionsByArticleId(articleId: string) {
    return await this.reactionRepository
      .createQueryBuilder('reaction')
      .select('reaction.type', 'type')
      .addSelect('COUNT(reaction.id)', 'count')
      .where('reaction.articleId = :articleId', { articleId })
      .groupBy('reaction.type')
      .orderBy('COUNT(reaction.id)', 'DESC')
      .getRawMany();
  }
}
