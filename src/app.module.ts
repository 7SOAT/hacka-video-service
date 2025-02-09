import { Module } from '@nestjs/common';
import { DynamoDBModule } from './database/dynamodb.module';
import { VideoModule } from './video/video.module';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DynamoDBModule,
    VideoModule,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
