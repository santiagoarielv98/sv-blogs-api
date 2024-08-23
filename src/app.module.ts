import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { DbModule } from './db/db.module';
import { FileService } from './file/file.service';
import { PostsModule } from './posts/posts.module';
import { SeedsService } from './seeds/seeds.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    DbModule,
    AuthModule,
    PostsModule,
  ],
  providers: [FileService, SeedsService],
})
export class AppModule {}
