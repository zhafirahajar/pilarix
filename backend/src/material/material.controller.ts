import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';

import { MaterialService } from './material.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { QueryMaterialDto } from './dto/query-material.dto';

@Controller('material')
export class MaterialController {
  constructor(private readonly service: MaterialService) {}

  @Post()
  create(@Body() dto: CreateMaterialDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryMaterialDto) {
    return this.service.findAll(query);
  }

  @Get(':id/stock')
  getStock(
    @Param('id', ParseIntPipe) materialId: number,
    @Query('projectId', ParseIntPipe) projectId: number,
  ) {
    return this.service.getStockByProject(materialId, projectId);
  }

  @Get(':id/stock-summary')
  getStockSummary(@Param('id', ParseIntPipe) id: number) {
    return this.service.getStockSummary(id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMaterialDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}