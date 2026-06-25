import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Ativando CORS para integração com o Frontend Next.js
  app.enableCors();

  // Validação global de payloads de entrada via class-validator/class-transformer
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Backend API rodando com sucesso em: http://localhost:${port}`);
}
bootstrap();
