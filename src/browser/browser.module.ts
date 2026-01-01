import { Module } from '@nestjs/common';
import { BrowserService } from './browser.service';

@Module({
  exports: [BrowserService],
  providers: [BrowserService],
})
export class BrowserModule {}
