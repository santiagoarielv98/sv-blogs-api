import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesModule } from './articles/articles.module';
import { DATABASE_CONFIG } from './config/constants';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService) => configService.get(DATABASE_CONFIG),
      inject: [ConfigService],
    }),
    ArticlesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
