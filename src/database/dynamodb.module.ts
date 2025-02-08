import { Module } from '@nestjs/common';
import { DynamoDBService } from './dynamodb.service';
import { DynamoDBInitService } from './dynamodb-init.service';

@Module({
  providers: [DynamoDBService, DynamoDBInitService],
  exports: [DynamoDBService],
})
export class DynamoDBModule {}
