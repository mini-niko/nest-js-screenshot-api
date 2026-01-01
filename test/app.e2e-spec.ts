import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { ScreenshotModule } from '../src/screenshot/screenshot.module';

describe('ScreenshotController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ScreenshotModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/api/screenshot (GET)', () => {
    it('without URL should return 400', () => {
      return request(app.getHttpServer()).get('/api/screenshot').expect(400);
    });

    it('with invalid URL should return 400', () => {
      return request(app.getHttpServer())
        .get('/api/screenshot?url=invalid_url')
        .expect(400);
    });

    it('with valid URL should return 200', () => {
      const normalizedUrl = 'https%3A%2F%2Fwww.google.com%2F';

      return request(app.getHttpServer())
        .get(`/api/screenshot?url=${normalizedUrl}`)
        .expect(200);
    });
  });
});
