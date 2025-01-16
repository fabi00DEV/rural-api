import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateProducerUseCase } from '@/core/use-cases/producer/create-producer.use-case';
import { UpdateProducerUseCase } from '@/core/use-cases/producer/update-producer.use-case';
import { DeleteProducerUseCase } from '@/core/use-cases/producer/delete-producer.use-case';
import { GetProducerUseCase } from '@/core/use-cases/producer/get-producer.use-case';
import { CreateProducerDto } from '../dtos/producer/create-producer.dto';
import { UpdateProducerDto } from '../dtos/producer/update-producer.dto';

@ApiTags('Produtores')
@Controller('producers')
export class ProducerController {
  constructor(
    private readonly createProducerUseCase: CreateProducerUseCase,
    private readonly updateProducerUseCase: UpdateProducerUseCase,
    private readonly deleteProducerUseCase: DeleteProducerUseCase,
    private readonly getProducerUseCase: GetProducerUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo produtor' })
  @ApiResponse({ status: 201, description: 'Produtor criado com sucesso' })
  create(@Body() createProducerDto: CreateProducerDto) {
    return this.createProducerUseCase.execute(createProducerDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar produtor por ID' })
  findOne(@Param('id') id: string) {
    return this.getProducerUseCase.execute(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar produtor' })
  update(
    @Param('id') id: string,
    @Body() updateProducerDto: UpdateProducerDto,
  ) {
    return this.updateProducerUseCase.execute({ id, ...updateProducerDto });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar produtor' })
  remove(@Param('id') id: string) {
    return this.deleteProducerUseCase.execute(id);
  }
}
