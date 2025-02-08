import { Injectable, Logger } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DynamoDBService {
  private readonly logger = new Logger(DynamoDBService.name);
  private readonly client: DynamoDBDocumentClient;

  constructor(private readonly configService: ConfigService) {
    const dynamoDBClient = new DynamoDBClient({
      region: this.configService.get<string>('AWS_REGION') || 'us-east-1',
      endpoint: this.configService.get<string>('AWS_ENDPOINT_URL'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
    });

    this.client = DynamoDBDocumentClient.from(dynamoDBClient);
    this.logger.log('DynamoDB client initialized');
  }

  getClient(): DynamoDBDocumentClient {
    return this.client;
  }
}
