import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateFarmDto } from '../dtos/farm/create-farm.dto';
import { CreateFarmUseCase } from '@/core/use-cases/farm/create-farm.use-case';
import { Farm } from '@/core/domain/entities/farm.entity';

@Controller('farms')
@ApiTags('farms')
export class FarmController {
  constructor(private readonly createFarmUseCase: CreateFarmUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova fazenda' })
  @ApiResponse({ status: 201, description: 'Fazenda criada com sucesso' })
  async create(@Body() createFarmDto: CreateFarmDto): Promise<Farm> {
    return this.createFarmUseCase.execute(createFarmDto);
  }
}
