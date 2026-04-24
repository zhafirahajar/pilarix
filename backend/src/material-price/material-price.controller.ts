import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { MaterialPriceService } from './material-price.service';
import { CreateMaterialPriceDto } from './dto/create-material-price.dto';
import { CreateBulkMaterialPriceDto } from './dto/create-bulk-material-price.dto';
import { UpdateMaterialPriceDto } from './dto/update-material-price.dto';

@Controller('project-material-prices')
export class MaterialPriceController {
  constructor(
    private readonly service: MaterialPriceService,
  ) {}

  @Post('/:projectId')
  create(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() dto: CreateMaterialPriceDto
  ) {
    return this.service.create({ ...dto}, projectId);
  }

  @Post('bulk/:projectId')
  createBulk(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() dto: CreateBulkMaterialPriceDto
  ) {
    return this.service.createBulk(dto, projectId);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('project/:projectId')
  findByProject(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.service.findByProject(projectId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Put('/:projectId')
  update(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() dto: UpdateMaterialPriceDto,
  ) {
    return this.service.update(projectId, dto);
  }

  @Delete('/:projectId/:materialId')
  remove(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('materialId', ParseIntPipe) materialId: number
  ) {
    return this.service.remove(materialId, projectId);
  }
}