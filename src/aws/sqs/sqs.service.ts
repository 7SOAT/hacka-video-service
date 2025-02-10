import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SqsService {
  private readonly logger = new Logger(SqsService.name);
  private sqs: SQSClient;
  private queueUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.sqs = new SQSClient({
      region: this.configService.get<string>('AWS_REGION') || 'us-east-1',
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID') || '',
        secretAccessKey:
          this.configService.get<string>('AWS_SECRET_ACCESS_KEY') || '',
        sessionToken: this.configService.get<string>('AWS_SESSION_TOKEN'),
      },
    });

    this.queueUrl = this.configService.get<string>('SQS_QUEUE_URL') || '';
    this.logger.log(`SQS Service initialized`);
  }

  async sendMessage(messageBody: Record<string, any>): Promise<void> {
    try {
      this.logger.log(`Sending message to queue`);
      const command = new SendMessageCommand({
        QueueUrl: this.queueUrl,
        MessageBody: JSON.stringify(messageBody),
      });

      const response = await this.sqs.send(command);
      this.logger.log(`Message sent with message id: ${response.MessageId}`);
    } catch (error) {
      this.logger.error(`Error sending message: ${error.message || error}`);
      throw error;
    }
  }
}
