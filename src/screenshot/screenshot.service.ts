import { Injectable } from '@nestjs/common';
import { BrowserService } from 'src/browser/browser.service';

@Injectable()
export class ScreenshotService {
  constructor(private readonly browserService: BrowserService) {}

  async takeByUrl(url: string): Promise<Buffer> {
    return await this.browserService.execute(async (browser) => {
      const context = await browser.newContext({
        viewport: { width: 1280, height: 720 },
      });

      const page = await context.newPage();

      try {
        await page.goto(url, {
          waitUntil: 'networkidle',
          timeout: 15_000,
        });

        return await page.screenshot({
          type: 'png',
          fullPage: true,
        });
      } finally {
        await context.close();
      }
    });
  }
}
