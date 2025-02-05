import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Middleware for parsing cookies
  app.use(cookieParser());

  // Swagger configuration
  const swaggerConfig = new DocumentBuilder()
    .setTitle('API with NestJS')
    .setDescription('Documentation for the Ateck app')
    .setVersion('1.0')
    .addBearerAuth(
      {
        description:
          'Please enter the token in the following format: Bearer <JWT>',
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header',
      },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  // Enable CORS
  app.enableCors({
    origin: [
      'http://localhost:8081',
      'http://192.168.100.4:8081',
      'http://192.168.43.23:3000',
    ], // Allow your mobile app address
    methods: ['GET', 'POST', 'PUT', 'UPDATE','DELETE'],
  });

  // Set global prefix for all routes
  app.setGlobalPrefix('api');

  // Configure port and host
  const port = parseInt(process.env.PORT, 10) || 3000;
  const host = process.env.HOST || '0.0.0.0'; // For Android emulator use '10.0.2.2'

  // Start the application
  await app.listen(port, host);
  console.log(`Application is running on: http://${host}:${port}`);
}

bootstrap();
