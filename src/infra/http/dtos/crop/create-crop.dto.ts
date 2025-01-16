import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCropDto {
  @ApiProperty({ example: 'Soja' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '2023/2024' })
  @IsString()
  @IsNotEmpty()
  harvest: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  farmId: string;
}
