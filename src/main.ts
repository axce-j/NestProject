// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import * as cookieParser from 'cookie-parser';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   app.use(cookieParser());
//   const swaggerConfig = new DocumentBuilder()
//     .setTitle('Api with nest')
//     .setDescription('for ateck app')
//     .setVersion('1.0')
//     .addBearerAuth(
//       {
//         description:
//           '[just text field] Please enter token in folowing format: Bearer <JWT>',
//         name: 'Authorizatio',
//         bearerFormat: 'Bearer',
//         scheme: 'Bearer',
//         type: 'http',
//         in: 'Header',
//       },
//       'access-token',
//     )
//     .build();

//   const document = SwaggerModule.createDocument(app, swaggerConfig);
//   SwaggerModule.setup('api/docs', app, document);
//   app.setGlobalPrefix('api');
//   const port = process.env.PORT || 3000; // Use the environment variable PORT or default to 3000

//   await app.listen(port, '0.0.0.0');
// }
// bootstrap();

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

  // Set global prefix for all routes
  app.setGlobalPrefix('api');

  // Configure port and host
  const port = parseInt(process.env.PORT, 10) || 3000;
  const host = process.env.HOST || '0.0.0.0';

  // Start the application
  await app.listen(port, host);
  console.log(`Application is running on: http://${host}:${port}`);
}

bootstrap();
