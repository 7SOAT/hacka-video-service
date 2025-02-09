import { Injectable } from '@nestjs/common';
import { HealthIndicatorService, HealthCheckError } from '@nestjs/terminus';
import { DynamoDBClient, ListTablesCommand } from '@aws-sdk/client-dynamodb';

@Injectable()
export class DynamoHealthIndicator {
  private dynamoClient = new DynamoDBClient({
    region: process.env.AWS_REGION || 'us-east-1',
  });

  constructor(
    private readonly healthIndicatorService: HealthIndicatorService,
  ) {}

  async isHealthy(key: string): Promise<any> {
    try {
      await this.dynamoClient.send(new ListTablesCommand({}));
      return {
        [key]: {
          status: 'up',
          time: new Date().toISOString(),
        },
      };
    } catch (error) {
      throw new HealthCheckError('DynamoDB check failed', {
        [key]: {
          status: 'down',
          message: error.message,
        },
      });
    }
  }
}
