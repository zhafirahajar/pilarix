import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { CreateAnalysisDto } from './dto/create-analysis.dto';
import { UpdateAnalysisDto } from './dto/update-analysis.dto';
import { CreateAnalysisItemDto } from './dto/create-analysis-item.dto';

@Controller('analysis')
export class AnalysisController {
  constructor(private readonly service: AnalysisService) {}

  // CREATE
  @Post()
  create(@Body() dto: CreateAnalysisDto) {
    return this.service.create(dto);
  }

  // GET ALL
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // GET ONE
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  // UPDATE
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAnalysisDto) {
    return this.service.update(Number(id), dto);
  }

  // DELETE
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }

  // =============================
  // 🔥 ITEMS
  // =============================

  @Post(':id/items')
  addItem(
    @Param('id') id: string,
    @Body() dto: CreateAnalysisItemDto,
  ) {
    return this.service.addItem(Number(id), dto);
  }

  @Delete('items/:itemId')
  removeItem(@Param('itemId') itemId: string) {
    return this.service.removeItem(Number(itemId));
  }

  // =============================
  // 💰 CALCULATION
  // =============================

  @Get(':id/calculate')
  calculateUnitPrice(
    @Param('id', ParseIntPipe) id: number,
    @Query('projectId', ParseIntPipe) projectId: number,
  ) {
    return this.service.calculateUnitPrice(id, projectId);
  }
}