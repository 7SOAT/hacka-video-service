import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { DynamoDBModule } from 'src/database/dynamodb.module';
import { S3Module } from 'src/aws/s3/s3.module';

@Module({
  imports: [DynamoDBModule, S3Module],
  providers: [VideoService],
  exports: [VideoService],
  controllers: [VideoController],
})
export class VideoModule {}
