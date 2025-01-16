import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateFarmDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  totalArea: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  agriculturalArea: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  vegetationArea: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  producerId: string;
}
