import {
  Controller,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Get,
  Patch,
  Delete,
} from '@nestjs/common';

import { MaterialUsageService } from './material-usage.service';
import { CreateMaterialUsageDto } from './dto/create-material-usage.dto';
import { UpdateMaterialUsageDto } from './dto/update-material-usage.dto';

@Controller('rab-item/:rabItemId/materials')
export class MaterialUsageController {
  constructor(private readonly service: MaterialUsageService) {}

  @Post()
  create(
    @Param('rabItemId', ParseIntPipe) rabItemId: number,
    @Body() dto: CreateMaterialUsageDto,
  ) {
    return this.service.create(rabItemId, dto);
  }

  @Get()
  findAll(@Param('rabItemId', ParseIntPipe) rabItemId: number) {
    return this.service.findByRabItem(rabItemId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMaterialUsageDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}