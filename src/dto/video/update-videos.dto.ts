import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateVideosDto {
  @ApiProperty({
    description: 'Video Id',
    example: 'uuid',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'User Id',
    example: 'uuid',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'S3 key',
    example: 'userId/id/filename.mp4',
  })
  @IsString()
  s3Key: string;

  @ApiProperty({
    description: 'Status of the video',
    example: 'uploaded',
  })
  @IsString()
  status: string;

  @ApiProperty({
    description: 'S3 zip key',
    example: 'userId/id/filename.zip',
  })
  @IsString()
  s3ZipKey: string;
}
