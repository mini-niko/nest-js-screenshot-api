import { NestFactory } from '@nestjs/core';
import { ScreenshotModule } from './screenshot/screenshot.module';

async function bootstrap() {
  const app = await NestFactory.create(ScreenshotModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
