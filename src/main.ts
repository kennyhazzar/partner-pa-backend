import { NestFactory } from '@nestjs/core';
import { AppModule } from '@resources/app.module';
import { ConfigService } from '@nestjs/config';
import { CommonConfigs } from '@core/types';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const { port } = app.get(ConfigService).get<CommonConfigs>('common');

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder().setTitle('Partner').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(port, async () =>
    console.log(`app was running on ${await app.getUrl()}`),
  );
}
bootstrap();
