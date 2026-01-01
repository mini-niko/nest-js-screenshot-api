import {
  BadRequestException,
  Controller,
  Get,
  Query,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { ScreenshotService } from './screenshot.service';

@Controller('api')
export class ScreenshotController {
  constructor(private readonly screenshotService: ScreenshotService) {}

  @Get('screenshot')
  async screenshot(
    @Query('url') url: string,
    @Res() response: Response,
  ): Promise<void> {
    if (!url) throw new BadRequestException('URL inválida');

    const buffer = await this.screenshotService.takeByUrl(url);

    response.setHeader('Content-Type', 'image/png');
    response.setHeader(
      'Content-Disposition',
      'inline; filename="screenshot.png"',
    );

    response.send(buffer);
  }
}
