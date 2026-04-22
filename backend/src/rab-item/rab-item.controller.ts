import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RabItemService } from './rab-item.service';
import { CreateRabItemDto } from './dto/create-rab-item.dto';

@Controller('rab-item')
export class RabItemController {
  constructor(private service: RabItemService) {}

  @Post()
  async create(@Body() dto: CreateRabItemDto) {
    return this.service.create(dto);
  }
  
  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @Get('pekerjaan/:id')
  async findByPekerjaan(@Param('id') id: string) {
    return this.service.findByPekerjaan(Number(id));
  }
}