import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateVideoDto {
  @ApiProperty({
    description: 'User ID',
    example: '53952758-19e6-4977-b746-bbabba4d6847',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'S3 key',
    example: 'userId/id/filename.mp4',
  })
  @IsString()
  @IsNotEmpty()
  s3Key: string;

  @ApiProperty({
    description: 'Id of the video',
    example: '53952758-19e6-4977-b746-bbabba4d6847',
  })
  @IsString()
  @IsNotEmpty()
  id: string;
}
