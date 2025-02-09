import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DynamoDBService } from './dynamodb.service';
import {
  CreateTableCommand,
  ScalarAttributeType,
  KeyType,
  GlobalSecondaryIndex,
} from '@aws-sdk/client-dynamodb';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DynamoDBInitService implements OnModuleInit {
  private readonly logger = new Logger(DynamoDBInitService.name);

  constructor(
    private readonly dynamoDBService: DynamoDBService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.createTables();
  }

  private async createTables() {
    const client = this.dynamoDBService.getClient();

    const tables = [
      {
        TableName: this.configService.get<string>('DYNAMODB_TABLE'),
        AttributeDefinitions: [
          { AttributeName: 'id', AttributeType: ScalarAttributeType.S },
          { AttributeName: 'userId', AttributeType: ScalarAttributeType.S },
        ],
        KeySchema: [
          { AttributeName: 'id', KeyType: KeyType.HASH },
          { AttributeName: 'userId', KeyType: KeyType.RANGE },
        ],
        ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
        GlobalSecondaryIndexes: [
          {
            IndexName: 'userId-index',
            KeySchema: [{ AttributeName: 'userId', KeyType: KeyType.HASH }],
            Projection: {
              ProjectionType: 'ALL',
            },
            ProvisionedThroughput: {
              ReadCapacityUnits: 5,
              WriteCapacityUnits: 5,
            },
          },
        ] as GlobalSecondaryIndex[],
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
