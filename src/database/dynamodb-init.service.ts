import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DynamoDBService } from './dynamodb.service';
import {
  CreateTableCommand,
  ScalarAttributeType,
  KeyType,
} from '@aws-sdk/client-dynamodb';

@Injectable()
export class DynamoDBInitService implements OnModuleInit {
  private readonly logger = new Logger(DynamoDBInitService.name);

  constructor(private readonly dynamoDBService: DynamoDBService) {}

  async onModuleInit() {
    await this.createTables();
  }

  private async createTables() {
    const client = this.dynamoDBService.getClient();

    const tables = [
      {
        TableName: 'videos',
        AttributeDefinitions: [
          { AttributeName: 'id', AttributeType: ScalarAttributeType.S },
          { AttributeName: 'userId', AttributeType: ScalarAttributeType.S },
        ],
        KeySchema: [
          { AttributeName: 'id', KeyType: KeyType.HASH },
          { AttributeName: 'userId', KeyType: KeyType.RANGE },
        ],
        ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
      },
    ];

    for (const table of tables) {
      try {
        this.logger.log(`Creating table ${table.TableName}`);

        await client.send(new CreateTableCommand(table));
        this.logger.log(`Table ${table.TableName} created`);
      } catch (error) {
        if (error.name === 'ResourceInUseException') {
          this.logger.warn(`Table ${table.TableName} already exists`);
        } else {
          this.logger.error(
            `Failed to create table ${table.TableName}: ${error.message || error}`,
          );
        }
      }
    }
  }
}
