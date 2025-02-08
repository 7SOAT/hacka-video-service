import { Injectable, Logger } from '@nestjs/common';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Multer } from 'multer';
import { ConfigService } from '@nestjs/config';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
  private readonly client: S3Client;
  private readonly bucketName: string;
  private readonly logger = new Logger(S3Service.name);

  constructor(private readonly configService: ConfigService) {
    this.client = new S3Client({
      region: this.configService.get<string>('AWS_REGION') || 'us-east-1',
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
      endpoint: this.configService.get<string>('AWS_ENDPOINT_URL'),
      forcePathStyle: true,
    });

    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');
    this.logger.log(`AWS S3 client created with bucket: ${this.bucketName}`);
  }

  async uploadFile(file: Multer.File, videoId: string, videoUserId: string) {
    try {
      if (!file || !file.buffer) {
        throw new Error('File is empty');
      }

      this.logger.log(`Using bucket: ${this.bucketName}`);
      const fileKey = `${videoId}/${videoUserId}-${file.originalname}`;

      const upload = new Upload({
        client: this.client,
        params: {
          Bucket: this.bucketName,
          Key: fileKey,
          Body: file.buffer,
          ContentType: file.mimetype,
        },
      });

      await upload.done();
      this.logger.log(`File uploaded: ${fileKey}`);
      return `https://${this.bucketName}.s3.amazonaws.com/${fileKey}`;
    } catch (error) {
      this.logger.error(`Failed to upload file: ${error.message || error}`);
      throw error;
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

  async download(fileKey: string) {
    try {
      this.logger.log(
        `Attempting to download file from bucket: ${this.bucketName} with key: ${fileKey}`,
      );

      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
      });

      const fileUrl = await getSignedUrl(this.client, command, {
        expiresIn: 3600,
      });

      this.logger.log(`File downloaded: ${fileKey}`);

      return fileUrl;
    } catch (error) {
      this.logger.error(`Failed to download file: ${error.message || error}`);
      throw error;
    }
  }
}
