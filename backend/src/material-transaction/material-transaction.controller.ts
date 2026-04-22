// material-transaction.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  ParseIntPipe,
} from '@nestjs/common';

import { MaterialTransactionService } from './material-transaction.service';
import { CreateMaterialTransactionDto } from './dto/create-material-transaction.dto';
import { QueryMaterialTransactionDto } from './dto/query-material-transaction.dto';

@Controller('material-transaction')
export class MaterialTransactionController {
  constructor(private readonly service: MaterialTransactionService) {}

  @Post()
  create(@Body() dto: CreateMaterialTransactionDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryMaterialTransactionDto) {
    return this.service.findAll(query);
  }

  @Get('project/:projectId')
  getByProject(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.service.getByProject(projectId);
  }
}