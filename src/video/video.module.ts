import { Module } from '@nestjs/common';
import { DynamoDBModule } from 'src/database/dynamodb.module';
import { VideoService } from './video.service';

@Module({
  imports: [DynamoDBModule],
  providers: [VideoService],
  exports: [VideoService],
})
export class VideoModule {}
