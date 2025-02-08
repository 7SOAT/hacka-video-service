import { Injectable, Logger } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';

@Injectable()
export class S3Service {
  private readonly client: S3Client;
  private readonly bucketName: string;
  private readonly logger = new Logger(S3Service.name);

  constructor() {
    this.client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });

    this.bucketName = process.env.AWS_S3_BUCKET_NAME!;
  }
  async uploadFile(file: Express.Multer.File): Promise<string> {
    try {
      const fileKey = `${randomUUID()}-${file.originalname}`;

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await this.client.send(command);
      this.logger.log(`File uploaded: ${fileKey}`);
      return `https://${this.bucketName}.s3.amazonaws.com/${fileKey}`;
    } catch (error) {
      this.logger.error(`Failed to upload file: ${error.message || error}`);
    }
  }

  async deleteFile(fileKey: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
      });

      await this.client.send(command);
      this.logger.log(`File deleted: ${fileKey}`);
    } catch (error) {
      this.logger.error(`Failed to delete file: ${error.message || error}`);
    }
  }

  async download(fileKey: string): Promise<Buffer> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
      });

      const response = await this.client.send(command);
      this.logger.log(`File downloaded: ${fileKey}`);
    } catch (error) {
      this.logger.error(`Failed to download file: ${error.message || error}`);
    }
  }
}
