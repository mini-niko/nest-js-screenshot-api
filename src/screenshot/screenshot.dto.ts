import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ScreenshotQueryDto {
  @IsNotEmpty()
  @IsUrl({
    require_protocol: true,
    require_valid_protocol: true,
    protocols: ['http', 'https'],
  })
  url: string;

  @IsOptional()
  @IsString()
  @IsIn(['png', 'jpeg'])
  format?: 'png' | 'jpeg';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(3840)
  device_width?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(3840)
  device_height?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(3840)
  clip_x?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(3840)
  clip_y?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(3840)
  clip_width?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(3840)
  clip_height?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(30000)
  delay?: number;
}

export class ScreenshotOptionsDto {
  format: 'png' | 'jpeg';
  delay: number;
  viewport: {
    width: number;
    height: number;
  };
  clip?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}
