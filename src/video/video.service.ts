import {
  DeleteItemCommand,
  GetItemCommand,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb';
import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { S3Service } from 'src/aws/s3/s3.service';
import { DynamoDBService } from 'src/database/dynamodb.service';
import { CreateVideoDto } from 'src/dto/video/create-video.dto';
import { FindVideoDto } from 'src/dto/video/find-video.dto';
import { UpdateVideosDto } from 'src/dto/video/update-videos.dto';

@Injectable()
export class VideoService {
  private readonly tableName = 'videos';
  private readonly logger = new Logger(VideoService.name);

  constructor(
    private readonly dynamoDBService: DynamoDBService,
    private readonly s3Service: S3Service,
  ) {}

  async findAll() {
    try {
      const command = new ScanCommand({
        TableName: this.tableName,
      });

      const { Items } = await this.dynamoDBService.getClient().send(command);

      if (Items?.length <= 0) {
        throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
      }

      this.logger.log(`Fetched ${Items?.length} videos`);
      return Items;
    } catch (error) {
      this.logger.error(`Failed to fetch videos: ${error.message || error}`);
    }
  }

  async findById({ id, userId }: FindVideoDto) {
    try {
      const command = new GetItemCommand({
        TableName: this.tableName,
        Key: {
          id: { S: id },
          userId: { S: userId },
        },
      });

      const { Item } = await this.dynamoDBService.getClient().send(command);

      if (!Item) {
        throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
      }

      this.logger.log(`Fetched video with ID ${id}`);
      return Item;
    } catch (error) {
      this.logger.error(
        `Failed to fetch video with ID ${id}: ${error.message || error}`,
      );
    }
  }

  async create(video: CreateVideoDto) {
    try {
      const command = new PutItemCommand({
        TableName: this.tableName,
        Item: {
          id: { S: video.id },
          userId: { S: video.userId },
          s3Key: { S: video.s3Key },
          createdAt: { S: new Date().toISOString() },
          updatedAt: { S: new Date().toISOString() },
        },
      });

      await this.dynamoDBService.getClient().send(command);
      this.logger.log(`Created video with ID ${video.id}`);

      const response = await this.findById({
        id: video.id,
        userId: video.userId,
      });
      return response;
    } catch (error) {
      this.logger.error(
        `Failed to create video with ID ${video.id}: ${error.message || error}`,
      );
    }
  }

  async delete(id: string) {
    try {
      const command = new DeleteItemCommand({
        TableName: this.tableName,
        Key: {
          id: { S: id },
        },
      });
      await this.dynamoDBService.getClient().send(command);

      this.logger.log(`Deleted video with ID ${id}`);
    } catch (error) {
      this.logger.error(
        `Failed to delete video with ID ${id}: ${error.message || error}`,
      );
    }
  }

  async update(id: string, userId: string, video: UpdateVideosDto) {
    try {
      const command = new PutItemCommand({
        TableName: this.tableName,
        Item: {
          id: { S: id },
          userId: { S: userId },
          s3Key: { S: video.s3Key },
          status: { S: video.status },
          updatedAt: { S: new Date().toISOString() },
          s3ZipKey: { S: video.s3ZipKey },
        },
      });
      await this.dynamoDBService.getClient().send(command);
      this.logger.log(`Updated video with ID ${id}`);
    } catch (error) {
      this.logger.error(
        `Failed to update video with ID ${id}: ${error.message || error}`,
      );
    }
  }

  async download({ id, userId }: FindVideoDto) {
    const video = await this.findById({ id, userId });

    this.logger.log(
      `Downloading video with ID ${id} and S3 key ${video.s3ZipKey.S}`,
    );

    const response = await this.s3Service.download(video.s3ZipKey.S);

    return response;
  }
}
