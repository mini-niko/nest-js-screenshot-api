import { Controller, Get, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ScreenshotService } from './screenshot.service';
import { ScreenshotOptionsDto, ScreenshotQueryDto } from './screenshot.dto';

@Controller('api')
export class ScreenshotController {
  constructor(private readonly screenshotService: ScreenshotService) {}

  @Get('screenshot')
  async screenshot(
    @Query() query: ScreenshotQueryDto,
    @Res() response: Response,
  ): Promise<void> {
    const { url } = query;

    const options = this.getOptionsByQuery(query);

    const buffer = await this.screenshotService.takeByUrl(url, options);

    const imageType = options.format;

    response.setHeader('Content-Type', `image/${imageType}`);
    response.setHeader(
      'Content-Disposition',
      `inline; filename="screenshot.${imageType}"`,
    );

    response.send(buffer);
  }

  getOptionsByQuery(query: ScreenshotQueryDto): ScreenshotOptionsDto {
    const viewport = {
      width: query.device_width ?? 1920,
      height: query.device_height ?? 1080,
    };

    const options: ScreenshotOptionsDto = {
      format: query.format ?? 'jpeg',
      viewport,
    };

    const hasClip =
      query.clip_width || query.clip_height || query.clip_x || query.clip_y;

    if (hasClip) {
      const clip = {
        x: query.clip_x ?? 0,
        y: query.clip_y ?? 0,
        width: query.clip_width ?? viewport.width,
        height: query.clip_height ?? viewport.height,
      };

      clip.width = Math.min(clip.width, viewport.width - clip.x);
      clip.height = Math.min(clip.height, viewport.height - clip.y);

      options.clip = clip;
    }

    return options;
  }
}
