import {
  BadRequestException,
  Controller,
  Get,
  Query,
  Res,
} from '@nestjs/common';
import { PlaywrightService } from './playwright.service';
import type { Response } from 'express';

@Controller('api')
export class ScreenshotController {
  constructor(private readonly pw: PlaywrightService) {}

  @Get('screenshot')
  async screenshot(@Query('url') url: string, @Res() response: Response) {
    if (!url || !this.isValidUrl(url))
      throw new BadRequestException('URL inválida');

    const buffer = await this.pw.screenshot(url);

    response.setHeader('Content-Type', 'image/png');
    response.setHeader(
      'Content-Disposition',
      'inline; filename="screenshot.png"',
    );

    response.send(buffer);
  }

  private isValidUrl(url: string): boolean {
    try {
      const parsed = new URL(url);
      return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
      return false;
    }
  }
}
