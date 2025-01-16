import { Controller, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateCropUseCase } from '@/core/use-cases/crop/create-crop.use-case';
import { UpdateCropUseCase } from '@/core/use-cases/crop/update-crop.use-case';
import { DeleteCropUseCase } from '@/core/use-cases/crop/delete-crop.use-case';
import { CreateCropDto } from '../dtos/crop/create-crop.dto';
import { UpdateCropDto } from '../dtos/crop/update-crop.dto';

@ApiTags('Culturas')
@Controller('crops')
export class CropController {
  constructor(
    private readonly createCropUseCase: CreateCropUseCase,
    private readonly updateCropUseCase: UpdateCropUseCase,
    private readonly deleteCropUseCase: DeleteCropUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova cultura' })
  @ApiResponse({ status: 201, description: 'Cultura criada com sucesso' })
  create(@Body() createCropDto: CreateCropDto) {
    return this.createCropUseCase.execute(createCropDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar cultura' })
  update(@Param('id') id: string, @Body() updateCropDto: UpdateCropDto) {
    return this.updateCropUseCase.execute({ id, ...updateCropDto });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar cultura' })
  remove(@Param('id') id: string) {
    return this.deleteCropUseCase.execute(id);
  }
}
