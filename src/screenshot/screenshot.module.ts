import { Module } from '@nestjs/common';
import { ScreenshotController } from './screenshot.controller';
import { PlaywrightService } from './playwright.service';

@Module({
  imports: [],
  controllers: [ScreenshotController],
  providers: [PlaywrightService],
})
export class ScreenshotModule {}
