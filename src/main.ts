import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Api with nest')
    .setDescription('for ateck app')
    .setVersion('1.0')
    .addBearerAuth(
      {
        description:
          '[just text field] Please enter token in folowing format: Bearer <JWT>',
        name: 'Authorizatio',
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
  app.setGlobalPrefix('api');
  const port = process.env.PORT || 3000; // Use the environment variable PORT or default to 3000

  await app.listen(port, '0.0.0.0');
}
bootstrap();
