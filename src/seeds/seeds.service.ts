import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

import { User } from 'src/users/entities/user.entity';
import { Article } from '../articles/entities/article.entity';
import { Like } from '../likes/entities/like.entity';
import { Comment } from '../comments/entities/comment.entity';
import { Tag } from '../tags/entities/tag.entity';

import * as USERS from 'src/mocks/USERS_MOCK_DATA.json';
import * as ARTICLES from 'src/mocks/ARTICLES_MOCK_DATA.json';
import * as COMMENTS from 'src/mocks/COMMENTS_MOCK_DATA.json';

@Injectable()
export class SeedsService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    @InjectRepository(Tag)
    private tagsRepository: Repository<Tag>,
  ) {}

  async countUsers() {
    return await this.usersRepository.count();
  }

  async createUsers() {
    return await this.usersRepository.save(this.usersRepository.create(USERS));
  }

  async createArticles({ users }: { users: User[] }) {
    const articles = ARTICLES.map((article) => ({
      ...article,
      user: users[Math.floor(Math.random() * users.length)],
    }));
    return await this.articlesRepository.save(articles);
  }

  async followUsers({ users }: { users: User[] }) {
    const user = users[0];
    user.following = users.slice(1);
    return await this.usersRepository.save(user);
  }

  async createComments({
    users,
    articles,
  }: {
    users: User[];
    articles: Article[];
  }) {
    const comments = articles.map((article) => ({
      article,
      user: users[Math.floor(Math.random() * users.length)],
      content: COMMENTS[Math.floor(Math.random() * COMMENTS.length)].content,
    }));
    return await this.commentsRepository.save(comments);
  }

  async createLikes({
    users,
    articles,
    comments,
  }: {
    users: User[];
    articles: Article[];
    comments: Comment[];
  }) {
    const likes = [
      ...articles.map((article) => ({
        article,
        user: users[Math.floor(Math.random() * users.length)],
      })),
      ...comments.map((comment) => ({
        comment,
        user: users[Math.floor(Math.random() * users.length)],
      })),
    ];
    return await this.likesRepository.save(likes);
  }

  async createUserAndArticle() {
    const user = await this.usersRepository.save({
      username: 'elvis',
      email: 'test@test.com',
      password: '123456',
    });

    const article = await this.articlesRepository.save({
      title: 'Los Beneficios de Aprender a Programar en el Mundo Moderno',
      slug: 'beneficios-aprender-programar-mundo-moderno',
      content: `En la era digital en la que vivimos, aprender a programar se ha convertido en una habilidad fundamental. No solo abre puertas a numerosas oportunidades profesionales, sino que también ofrece una serie de beneficios personales. Aquí exploramos algunos de los principales:

1. **Desarrollo del Pensamiento Crítico:** La programación enseña a descomponer problemas complejos en partes más manejables, fomentando un pensamiento lógico y analítico.

2. **Oportunidades Laborales:** Con la creciente demanda de habilidades tecnológicas, los programadores tienen acceso a una amplia gama de oportunidades laborales en diferentes industrias, desde startups hasta grandes corporaciones.

3. **Flexibilidad y Creatividad:** La programación permite crear soluciones personalizadas, aplicaciones innovadoras y productos únicos. Es una excelente manera de canalizar la creatividad y resolver problemas reales.

4. **Autonomía y Emprendimiento:** Aprender a programar brinda la capacidad de desarrollar tus propios proyectos, ya sea para mejorar procesos en tu trabajo actual o para iniciar un negocio propio.

5. **Mejora Continua:** La tecnología avanza rápidamente, y aprender a programar fomenta una mentalidad de aprendizaje continuo y adaptación a nuevas herramientas y lenguajes.

Aprender a programar no solo es una inversión en tu carrera, sino también en tu desarrollo personal y profesional. ¡Nunca es tarde para comenzar!`,
      user,
    });

    const othersUsers = await this.usersRepository.find({
      where: { id: Not(user.id) },
    });

    // comentarios
    await this.commentsRepository.save({
      article,
      user: othersUsers[Math.floor(Math.random() * othersUsers.length)],
      content: 'Excelente artículo, gracias por compartirlo.',
    });

    await this.commentsRepository.save({
      article,
      user: othersUsers[Math.floor(Math.random() * othersUsers.length)],
      content: 'Muy interesante, definitivamente es una habilidad valiosa.',
    });

    // comentario con respuestas
    const comment = await this.commentsRepository.save({
      article,
      user: othersUsers[Math.floor(Math.random() * othersUsers.length)],
      content:
        'Gracias por la información, ¿podrías recomendar algún recurso para aprender a programar?',
    });

    await this.commentsRepository.save({
      article,
      user: user,
      content:
        '¡Claro! Te recomiendo Codecademy y FreeCodeCamp, son excelentes plataformas para principiantes.',
      parent: comment,
    });

    await this.commentsRepository.save({
      article,
      user: othersUsers[Math.floor(Math.random() * othersUsers.length)],
      content: '¡Gracias por la recomendación!',
      parent: comment,
    });

    // like a comentario
    await this.likesRepository.save({
      comment,
      user: user,
    });

    // likes
    await Promise.all(
      othersUsers.map((user) => this.likesRepository.save({ article, user })),
    );

    // follow
    user.following = othersUsers;
    await this.usersRepository.save(user);

    return { user, article };
  }
}
