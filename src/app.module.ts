import { Module } from '@nestjs/common';
import { DynamoDBModule } from './database/dynamodb.module';
import { VideoModule } from './video/video.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DynamoDBModule,
    VideoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
