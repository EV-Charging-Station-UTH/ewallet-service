import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('E-Wallet API')
    .setDescription('E-Wallet System - Fintech Grade Backend')
    .setVersion('1.0')
    .addTag('Wallets')
    .addTag('Transactions')
    .addTag('Users')
    .addTag('KYC')
    .addTag('Bank Accounts')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`
  ╔═══════════════════════════════════════════╗
  ║ E-Wallet API Server is running!           ║
  ║                                           ║
  ║ URL: http://localhost:${port}             ║
  ║ Docs: http://localhost:${port}/api/docs   ║
  ╚═══════════════════════════════════════════╝
  `);
}

bootstrap();