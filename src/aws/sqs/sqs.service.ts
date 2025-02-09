import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SqsService {
  private readonly logger = new Logger(SqsService.name);
  private sqs: SQSClient;
  private readonly queueUrl = process.env.SQS_QUEUE_URL || '';

  constructor() {
    this.sqs = new SQSClient({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });
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
