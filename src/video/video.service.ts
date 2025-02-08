import {
  DeleteItemCommand,
  GetItemCommand,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb';
import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import { Injectable, Logger } from '@nestjs/common';
import { DynamoDBService } from 'src/database/dynamodb.service';

@Injectable()
export class VideoService {
  private readonly tableName = 'Videos';
  private readonly logger = new Logger(VideoService.name);

  constructor(private readonly dynamoDBService: DynamoDBService) {}

  async findAll() {
    try {
      const command = new ScanCommand({
        TableName: this.tableName,
      });

      const response = await this.dynamoDBService.getClient().send(command);
      this.logger.log(`Fetched ${response.Items?.length} videos`);
      return response.Items;
    } catch (error) {
      this.logger.error(`Failed to fetch videos: ${error.message || error}`);
    }
  }

  async findById(id: string) {
    try {
      const command = new GetItemCommand({
        TableName: this.tableName,
        Key: {
          id: { S: id },
        },
      });

      const response = await this.dynamoDBService.getClient().send(command);

      if (!response.Item) {
        this.logger.warn(`Video with ID ${id} not found`);
        return null;
      }

      this.logger.log(`Fetched video with ID ${id}`);
      return response.Item;
    } catch (error) {
      this.logger.error(
        `Failed to fetch video with ID ${id}: ${error.message || error}`,
      );
    }
  }

  async create(video: any) {
    try {
      const command = new PutItemCommand({
        TableName: this.tableName,
        Item: {
          id: { S: video.id },
          title: { S: video.title },
          url: { S: video.url },
        },
      });

      await this.dynamoDBService.getClient().send(command);
      this.logger.log(`Created video with ID ${video.id}`);
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

  async update(id: string, video: any) {
    try {
      const command = new PutItemCommand({
        TableName: this.tableName,
        Item: {
          id: { S: id },
          title: { S: video.title },
          url: { S: video.url },
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
}
