import { Injectable } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

@Injectable()
export class DynamoDBService {
  private readonly client: DynamoDBDocumentClient;

  constructor() {
    const dynamoDBClient = new DynamoDBClient({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });

    this.client = DynamoDBDocumentClient.from(dynamoDBClient);
  }

  getClient(): DynamoDBDocumentClient {
    return this.client;
  }
}
