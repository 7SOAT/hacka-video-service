import { Test, TestingModule } from '@nestjs/testing';
import { DynamoDBService } from 'src/database/dynamodb.service';
import { VideoService } from './video.service';
import { S3Service } from 'src/aws/s3/s3.service';
import { ConfigService } from '@nestjs/config';

describe('VideoService', () => {
  let service: VideoService;
  let dynamoDBService: DynamoDBService;
  let s3Service: S3Service;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VideoService,
        {
          provide: DynamoDBService,
          useValue: {
            getClient: jest.fn().mockReturnValue({
              download: jest.fn(),
            }),
          },
        },
        {
          provide: S3Service,
          useValue: {
            getClient: jest.fn().mockReturnValue({
              download: jest.fn(),
            }),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<VideoService>(VideoService);
    dynamoDBService = module.get<DynamoDBService>(DynamoDBService);
    s3Service = module.get<S3Service>(S3Service);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(dynamoDBService).toBeDefined();
    expect(s3Service).toBeDefined();
    expect(configService).toBeDefined();
  });

  it('should fetch all videos', async () => {
    const videos = [{ id: '1', userId: '1', title: 'video' }];
    jest.spyOn(dynamoDBService, 'getClient').mockReturnValue({
      send: jest.fn().mockResolvedValue({ Items: videos }),
    } as any);

    const result = await service.findAll();
    expect(result).toEqual(videos);
  });

  it('should fetch video by ID', async () => {
    const video = { id: '1', userId: '1', title: 'video' };
    jest.spyOn(dynamoDBService, 'getClient').mockReturnValue({
      send: jest.fn().mockResolvedValue({ Item: video }),
    } as any);

    const result = await service.findById({ id: '1', userId: '1' });
    expect(result).toEqual(video);
  });

  it('should create a video', async () => {
    const video = { id: '1', userId: '1', s3Key: 'key' };
    jest.spyOn(dynamoDBService, 'getClient').mockReturnValue({
      send: jest.fn().mockResolvedValue({
        Item: {
          id: { S: video.id },
          userId: { S: video.userId },
          s3Key: {
            S: video.s3Key,
          },
          status: {
            S: 'uploaded',
          },
          s3ZipKey: {
            S: 'zip',
          },
          updatedAt: {
            S: new Date().toISOString(),
          },
          createdAt: {
            S: new Date().toISOString(),
          },
        },
      }),
    } as any);

    const newVideo = {
      ...video,
      status: 'uploaded',
      s3ZipKey: 'zip',
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    const result = await service.create(video);
    expect(result).toEqual(newVideo);
  });

  it('should delete a video', async () => {
    const video = { id: '1', userId: '1' };
    jest.spyOn(dynamoDBService, 'getClient').mockReturnValue({
      send: jest.fn().mockResolvedValue({
        Item: video,
      }),
    } as any);

    const result = await service.delete(video.id);
    expect(result).toEqual(undefined);
  });

  it('should update a video', async () => {
    const oldVideo = {
      id: '1',
      userId: '1',
      s3Key: 'key',
      status: 'uploaded',
      s3ZipKey: 'zip',
      updatedAt: new Date().toISOString(),
    };

    jest.spyOn(dynamoDBService, 'getClient').mockReturnValue({
      send: jest.fn().mockResolvedValue({
        Item: {
          id: { S: oldVideo.id },
          userId: { S: oldVideo.userId },
          s3Key: {
            S: oldVideo.s3Key,
          },
          status: {
            S: oldVideo.status,
          },
          s3ZipKey: {
            S: oldVideo.s3ZipKey,
          },
          updatedAt: {
            S: oldVideo.updatedAt,
          },
        },
      }),
    } as any);

    const result = await service.update(oldVideo.id, oldVideo.userId, oldVideo);

    expect(result).toEqual({
      id: oldVideo.id,
      userId: oldVideo.userId,
      s3Key: oldVideo.s3Key,
      status: oldVideo.status,
      s3ZipKey: oldVideo.s3ZipKey,
      updatedAt: oldVideo.updatedAt,
    });
  });

  it('should find videos by user ID', async () => {
    const videos = [
      {
        id: '1',
        userId: '1',
        s3Key: 'key',
        status: 'uploaded',
        s3ZipKey: 'zip',
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        userId: '1',
        s3Key: 'key',
        status: 'uploaded',
        s3ZipKey: 'zip',
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
    ];
    jest.spyOn(dynamoDBService, 'getClient').mockReturnValue({
      send: jest.fn().mockResolvedValue({ Items: videos }),
    } as any);

    const result = await service.findByUserId('1');
    expect(result).toEqual(videos);
  });
});
