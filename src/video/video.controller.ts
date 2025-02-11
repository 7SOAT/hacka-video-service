import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { VideoService } from './video.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateVideoDto } from 'src/dto/video/create-video.dto';
import { UpdateVideosDto } from 'src/dto/video/update-videos.dto';

@ApiTags('videos')
@Controller('videos')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Get('download/by-id/:videoId')
  @ApiResponse({
    status: 200,
    description: 'Get a video by ID',
  })
  @ApiResponse({ status: 404, description: 'Not found.' })
  async download(
    @Param('videoId') id: string,
    @Query('userId') userID: string,
  ) {
    console.log(`Executing route: "GET download/:id/:userId"`);
    return await this.videoService.download({ id, userId: userID });
  }

  @Get('user/:userId')
  @ApiResponse({
    status: 200,
    description: 'List of videos',
  })
  @ApiResponse({ status: 404, description: 'Not found.' })
  async findByUserId(@Param('userId') userId: string) {
    console.log(`Executing route: "GET user/:userId"`);
    return await this.videoService.findByUserId(userId);
  }

  @Get('by-id/:videoId')
  @ApiResponse({
    status: 200,
    description: 'Get a video by ID',
  })
  @ApiResponse({ status: 404, description: 'Not found.' })
  async findById(
    @Param('videoId') id: string,
    @Query('userId') userID: string,
  ) {
    console.log(`Executing route: "GET /videos/:id/user/:userId"`);
    return await this.videoService.findById({ id, userId: userID });
  }

  @Get('all')
  @ApiResponse({
    status: 200,
    description: 'List of videos',
  })
  @ApiResponse({ status: 404, description: 'Not found.' })
  async findAll() {
    console.log(`Executing route: "GET /videos"`);
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

  @Put()
  @ApiResponse({
    status: 200,
    description: 'Update a video by ID',
  })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async update(@Body() video: UpdateVideosDto) {
    return await this.videoService.update(video);
  }
}
