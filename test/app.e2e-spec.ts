import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { ScreenshotModule } from 'src/screenshot/screenshot.module';

describe('ScreenshotController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ScreenshotModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: false,
      }),
    );
    await app.init();
  });

  describe('/api/screenshot (GET)', () => {
    describe('URL Validation', () => {
      it('without URL should return 400', () => {
        return request(app.getHttpServer())
          .get('/api/screenshot')
          .expect(400)
          .expect((res) => {
            expect(res.body.statusCode).toBe(400);
            expect(res.body.message[0]).toContain('url');
          });
      });

      it('with invalid URL should return 400', () => {
        return request(app.getHttpServer())
          .get('/api/screenshot?url=invalid_url')
          .expect(400)
          .expect((res) => {
            expect(res.body.statusCode).toBe(400);
            expect(res.body.message[0]).toContain('url');
          });
      });

      it('with URL missing protocol should return 400', () => {
        return request(app.getHttpServer())
          .get('/api/screenshot?url=example.com')
          .expect(400);
      });
    });

    describe('Format Parameter', () => {
      it('with valid URL and format=png should return 200 with image/png', () => {
        const url = 'https://example.com';
        return request(app.getHttpServer())
          .get(`/api/screenshot?url=${url}&format=png`)
          .expect(200)
          .expect('Content-Type', 'image/png');
      });

      it('with valid URL and format=jpeg should return 200 with image/jpeg', () => {
        const url = 'https://example.com';
        return request(app.getHttpServer())
          .get(`/api/screenshot?url=${url}&format=jpeg`)
          .expect(200)
          .expect('Content-Type', 'image/jpeg');
      });

      it('with invalid format should return 400', () => {
        const url = 'https://example.com';
        return request(app.getHttpServer())
          .get(`/api/screenshot?url=${url}&format=gif`)
          .expect(400);
      });
    });

    describe('Viewport Parameters', () => {
      it('with valid viewport dimensions should return 200', () => {
        const url = 'https://example.com';
        return request(app.getHttpServer())
          .get(`/api/screenshot?url=${url}&device_width=1280&device_height=720`)
          .expect(200);
      });

      it('with viewport width below minimum should return 400', () => {
        const url = 'https://example.com';
        return request(app.getHttpServer())
          .get(`/api/screenshot?url=${url}&device_width=0`)
          .expect(400);
      });

      it('with viewport width above maximum should return 400', () => {
        const url = 'https://example.com';
        return request(app.getHttpServer())
          .get(`/api/screenshot?url=${url}&device_width=4000`)
          .expect(400);
      });

      it('with non-integer viewport dimensions should return 400', () => {
        const url = 'https://example.com';
        return request(app.getHttpServer())
          .get(`/api/screenshot?url=${url}&device_width=abc`)
          .expect(400);
      });
    });

    describe('Clip Parameters', () => {
      it('with valid clip parameters should return 200', () => {
        const url = 'https://example.com';
        return request(app.getHttpServer())
          .get(
            `/api/screenshot?url=${url}&clip_x=100&clip_y=100&clip_width=800&clip_height=600`,
          )
          .expect(200);
      });

      it('with clip width exceeding viewport should be automatically adjusted', () => {
        const url = 'https://example.com';
        return request(app.getHttpServer())
          .get(
            `/api/screenshot?url=${url}&device_width=1000&device_height=1000&clip_x=0&clip_y=0&clip_width=2000&clip_height=2000`,
          )
          .expect(200);
      });

      it('with invalid clip parameters should return 400', () => {
        const url = 'https://example.com';
        return request(app.getHttpServer())
          .get(`/api/screenshot?url=${url}&clip_x=-1`)
          .expect(400);
      });
    });

    describe('Response Headers and Content', () => {
      it('should return correct Content-Type header based on format', () => {
        const url = 'https://example.com';
        return request(app.getHttpServer())
          .get(`/api/screenshot?url=${url}&format=png`)
          .expect(200)
          .expect('Content-Type', 'image/png')
          .expect('Content-Disposition', /inline; filename="screenshot.png"/);
      });

      it('should return image buffer in response body', () => {
        const url = 'https://example.com';
        return request(app.getHttpServer())
          .get(`/api/screenshot?url=${url}`)
          .expect(200)
          .then((res) => {
            expect(Buffer.isBuffer(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThan(0);
          });
      });
    });

    describe('Edge Cases', () => {
      it('with URL containing special characters should work', () => {
        const url = 'https://example.com/path?query=value&other=123';
        const encodedUrl = encodeURIComponent(url);
        return request(app.getHttpServer())
          .get(`/api/screenshot?url=${encodedUrl}`)
          .expect(200);
      });

      it('with very long URL should work', () => {
        const longUrl = 'https://example.com/' + 'a'.repeat(1000);
        return request(app.getHttpServer())
          .get(`/api/screenshot?url=${longUrl}`)
          .expect(200);
      });
    });

    describe('Delay Parameter', () => {
      it('with valid delay should return 200', () => {
        const url = 'https://example.com';
        return request(app.getHttpServer())
          .get(`/api/screenshot?url=${url}&delay=1000`)
          .expect(200);
      });

      it('with delay=0 should work (default)', () => {
        const url = 'https://example.com';
        return request(app.getHttpServer())
          .get(`/api/screenshot?url=${url}&delay=0`)
          .expect(200);
      });

      it('with delay above maximum should return 400', () => {
        const url = 'https://example.com';
        return request(app.getHttpServer())
          .get(`/api/screenshot?url=${url}&delay=35000`)
          .expect(400);
      });

      it('with negative delay should return 400', () => {
        const url = 'https://example.com';
        return request(app.getHttpServer())
          .get(`/api/screenshot?url=${url}&delay=-1`)
          .expect(400);
      });
    });

    describe('Combined Parameters', () => {
      it('with all parameters combined should work', () => {
        const url = 'https://example.com';
        return request(app.getHttpServer())
          .get(
            `/api/screenshot?url=${url}&format=png&device_width=1280&device_height=720&delay=500&clip_x=100&clip_y=100&clip_width=800&clip_height=600`,
          )
          .expect(200)
          .expect('Content-Type', 'image/png');
      });

      it('with viewport and clip parameters should work', () => {
        const url = 'https://example.com';
        return request(app.getHttpServer())
          .get(
            `/api/screenshot?url=${url}&device_width=1920&device_height=1080&clip_x=50&clip_y=50&clip_width=1000&clip_height=800`,
          )
          .expect(200);
      });
    });
  });
});
