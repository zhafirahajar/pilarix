import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PekerjaanService } from './pekerjaan.service';
import { CreatePekerjaanDto } from './dto/create-pekerjaan.dto';

@Controller('pekerjaan')
export class PekerjaanController {
  constructor(private service: PekerjaanService) {}

  @Post()
  async create(@Body() dto: CreatePekerjaanDto)
  {
    return this.service.create(dto);
  }
  
  @Get()
  async findAll() 
  {
    return this.service.findAll();
  }

  @Get('/:projectId')
  async findByProject(@Param('projectId') projectId: string) {
    return this.service.findByProject(Number(projectId));
  }

}