import { Injectable } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { DynamoHealthIndicator } from './dynamohealthindicator.service';

@Injectable()
export class HealthService {
  constructor(
    private healthService: HealthCheckService,
    private dynamoHealthIndicator: DynamoHealthIndicator,
  ) {}

  @HealthCheck()
  checkDatabase() {
    return this.healthService.check([
      () => this.dynamoHealthIndicator.isHealthy('dynamodb'),
    ]);
  }
}
