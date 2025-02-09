import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { DynamoHealthIndicator } from './dynamohealthindicator.service';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [HealthService, DynamoHealthIndicator],
  exports: [HealthService, DynamoHealthIndicator],
})
export class HealthModule {}
