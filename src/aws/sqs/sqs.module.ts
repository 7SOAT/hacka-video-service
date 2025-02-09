import { Module } from '@nestjs/common';
import { SqsService } from './sqs.service';

@Module({
  imports: [],
  providers: [SqsService],
  exports: [SqsService],
  controllers: [],
})
export class SqsModule {}
