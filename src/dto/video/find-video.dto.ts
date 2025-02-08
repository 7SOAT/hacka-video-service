import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FindVideoDto {
  @ApiProperty({
    description: 'Id of the video',
    example: '53952758-19e6-4977-b746-bbabba4d6847',
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'User ID',
    example: '53952758-19e6-4977-b746-bbabba4d6847',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
