import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { VideoService } from './video.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateVideoDto } from 'src/dto/video/create-video.dto';
import { UpdateVideosDto } from 'src/dto/video/update-videos.dto';

@ApiTags('videos')
@Controller('videos')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'List of videos',
  })
  @ApiResponse({ status: 404, description: 'Not found.' })
  async findAll() {
    return await this.videoService.findAll();
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Create a new video',
  })
  @ApiResponse({ status: 201, description: 'Created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async create(@Body() video: CreateVideoDto) {
    return await this.videoService.create(video);
  }

  @Get(':id/user/:userId')
  @ApiResponse({
    status: 200,
    description: 'Get a video by ID',
  })
  @ApiResponse({ status: 404, description: 'Not found.' })
  async findById(@Param('id') id: string, @Param('userId') userID: string) {
    return await this.videoService.findById({ id, userId: userID });
  }

  @Get('download/:id/:userId')
  @ApiResponse({
    status: 200,
    description: 'Get a video by ID',
  })
  @ApiResponse({ status: 404, description: 'Not found.' })
  async download(@Param('id') id: string, @Param('userId') userID: string) {
    return await this.videoService.download({ id, userId: userID });
  }

  @Put(':id/user/:userId')
  @ApiResponse({
    status: 200,
    description: 'Update a video by ID',
  })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async update(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Body() video: UpdateVideosDto,
  ) {
    return await this.videoService.update(id, userId, video);
  }

  @Get('user/:userId')
  @ApiResponse({
    status: 200,
    description: 'List of videos',
  })
  @ApiResponse({ status: 404, description: 'Not found.' })
  async findByUserId(@Param('userId') userId: string) {
    return await this.videoService.findByUserId(userId);
  }
}
