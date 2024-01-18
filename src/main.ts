import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const api_Version = configService.get('API_VERSION');
  app.setGlobalPrefix(api_Version);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Ahsan Project Documentation')
    .setDescription('APIS Document for Ahsan Project')
    .setVersion('1.0')
    // .setExternalDoc('Postman Collection Link', '/api-json')
    .addBearerAuth(
      {
        description: 'Default JWT Authorization',
        type: 'http',
        in: 'header',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(configService.get('PROJECT_PORT'));
}
bootstrap();
