import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRabItemDto } from './dto/create-rab-item.dto';

@Injectable()
export class RabItemService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateRabItemDto) {
    let name = dto.name;
    let unit = dto.unit;
    let unitPrice = dto.unitPrice ?? null;

    if (dto.analysisId) {
      const analysisInstance = await this.prisma.analysis.findUnique({
        where: { id: dto.analysisId },
        include: { items: true },
      });

      if (analysisInstance) {
        name = analysisInstance.name;
        unit = analysisInstance.unit;
        unitPrice = analysisInstance.items.reduce(
          (sum, item) => sum + item.price * item.coefficient,
          0,
        );
      } else {
        throw new NotFoundException(
          `Analysis with id ${dto.analysisId} not found`,
        );
      }
    }

    const totalPrice =
      dto.volume && unitPrice ? dto.volume * unitPrice : null;

    return this.prisma.rabItem.create({
      data: {
        ...dto,
        name,
        unit,
        unitPrice,
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