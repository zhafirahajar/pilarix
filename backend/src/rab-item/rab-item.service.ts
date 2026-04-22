import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRabItemDto } from './dto/create-rab-item.dto';

@Injectable()
export class RabItemService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateRabItemDto) {
    const totalPrice =
      dto.volume && dto.unitPrice
        ? dto.volume * dto.unitPrice
        : null;

    return this.prisma.rabItem.create({
      data: {
        ...dto,
        totalPrice,
      },
    });
  }

  async findAll() {
    return this.prisma.rabItem.findMany({
      include: {
        children: true,
        materials: {
          include: {
            material: true,
            },
        },
        },
        orderBy: { order: 'asc' },
    });
}

  async findByPekerjaan(pekerjaanId: number) {
    return this.prisma.rabItem.findMany({
      where: { pekerjaanId },
      include: {
        children: true,
        materials: {
          include: {
            material: true,
          },
        },
      },
      orderBy: { order: 'asc' },
    });
  }
}