import { Injectable } from '@nestjs/common';
import { BrowserService } from 'src/browser/browser.service';
import { ScreenshotOptionsDto } from './screenshot.dto';

@Injectable()
export class ScreenshotService {
  constructor(private readonly browserService: BrowserService) {}

  async takeByUrl(url: string, options: ScreenshotOptionsDto): Promise<Buffer> {
    return await this.browserService.execute(async (browser) => {
      const context = await browser.newContext({
        viewport: options.viewport,
      });

      const page = await context.newPage();

      try {
        await page.goto(url, {
          waitUntil: 'networkidle',
          timeout: 15_000,
        });

        return await page.screenshot({
          type: 'png',
          clip: options.clip,
          fullPage: !options.clip,
        });
      } finally {
        await context.close();
      }
    });
  }
}
