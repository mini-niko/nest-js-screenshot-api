import { Module } from '@nestjs/common';
import { ScreenshotController } from './screenshot.controller';
import { BrowserService } from '../browser/browser.service';
import { BrowserModule } from 'src/browser/browser.module';
import { ScreenshotService } from './screenshot.service';

@Module({
  imports: [BrowserModule],
  controllers: [ScreenshotController],
  providers: [BrowserService, ScreenshotService],
})
export class ScreenshotModule {}
