import { Test, TestingModule } from '@nestjs/testing';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';

describe('VideoController', () => {
  let controller: VideoController;
  let service: VideoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VideoController],
      providers: [
        {
          provide: VideoService,
          useValue: {
            findAll: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
            update: jest.fn(),
            download: jest.fn(),
            findByUserId: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<VideoController>(VideoController);
    service = module.get<VideoService>(VideoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should call service.download', async () => {
    const id = 'id';
    const userId = 'userId';
    await controller.download(id, userId);
    expect(service.download).toHaveBeenCalledWith({ id, userId });
  });

  it('should call service.findByUserId', async () => {
    const userId = 'userId';
    await controller.findByUserId(userId);
    expect(service.findByUserId).toHaveBeenCalledWith(userId);
  });

  it('should call service.findById', async () => {
    const id = 'id';
    const userId = 'userId';
    await controller.findById(id, userId);
    expect(service.findById).toHaveBeenCalledWith({ id, userId });
  });

  it('should call service.findAll', async () => {
    await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should call service.create', async () => {
    const video = { userId: 'userId', s3Key: 's3Key', id: 'id' };
    await controller.create(video);
    expect(service.create).toHaveBeenCalledWith(video);
  });

  it('should call service.update', async () => {
    const video = {
      id: 'id',
      userId: 'userId',
      s3Key: 's3Key',
      status: 'status',
      s3ZipKey: 's3ZipKey',
    };
    await controller.update(video);
    expect(service.update).toHaveBeenCalledWith(video);
  });
});
