import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRabItemDto } from './dto/create-rab-item.dto';

@Injectable()
export class RabItemService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateRabItemDto) {
    let unitPrice: number | null = null;
    let totalPrice: number | null = null;

    const analysisId = dto.analysisId;
    const analysisInstance = await this.prisma.analysis.findFirst({
      where: { id: analysisId },
    });

    if (analysisId && !analysisInstance) {
      throw new Error('Invalid analysisId');
    }

    const effectiveUnitPrice = analysisInstance?.totalPrice ?? dto.unitPrice ?? null;

    unitPrice = effectiveUnitPrice;
    totalPrice =
      dto.volume != null && effectiveUnitPrice != null
      ? dto.volume * effectiveUnitPrice
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