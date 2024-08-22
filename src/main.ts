import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { useRequestLogging } from './middlewares/request-logging';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useRequestLogging(app);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.enableCors({
    origin: 'http://localhost:3000',
  });
  await app.listen(8080);
}
bootstrap();
