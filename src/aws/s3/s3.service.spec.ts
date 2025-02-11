import { ConfigService } from '@nestjs/config';
import { S3Service } from './s3.service';
import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';

describe('S3Service', () => {
  let s3Service: S3Service;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        S3Service,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    s3Service = module.get<S3Service>(S3Service);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(s3Service).toBeDefined();
    expect(configService).toBeDefined();
  });

  it('should download a file', async () => {
    const fileKey = 'videoId/videoUserId-file.txt';
    const fileUrl =
      'https://bucket.s3.amazonaws.com/videoId/videoUserId-file.txt';
    const download = jest.fn().mockResolvedValue(fileUrl);
    jest.spyOn(s3Service, 'download').mockImplementation(download);
    const result = await s3Service.download(fileKey);
    expect(result).toBe(fileUrl);
    expect(download).toHaveBeenCalledWith(fileKey);
  });
});
