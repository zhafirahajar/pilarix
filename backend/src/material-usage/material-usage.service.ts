// material-usage.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMaterialUsageDto } from './dto/create-material-usage.dto';
import { UpdateMaterialUsageDto } from './dto/update-material-usage.dto';

@Injectable()
export class MaterialUsageService {
  constructor(private prisma: PrismaService) {}

  async create(rabItemId: number, dto: CreateMaterialUsageDto) {
    const rabItem = await this.prisma.rabItem.findUnique({
      where: { id: rabItemId },
    });

    if (!rabItem) {
      throw new NotFoundException('RabItem not found');
    }

    const existing = await this.prisma.materialUsage.findFirst({
      where: {
        rabItemId,
        materialId: dto.materialId,
      },
    });

    if (existing) {
      throw new BadRequestException(
        'Material already exists in this RAB item',
      );
    }

    return this.prisma.materialUsage.create({
      data: {
        rabItemId,
        materialId: dto.materialId,
        coefficient: dto.coefficient
      },
      include: {
        material: true,
      },
    });
  }

  async findByRabItem(rabItemId: number) {
    return this.prisma.materialUsage.findMany({
      where: { rabItemId },
      include: {
        material: true,
        rabItem: {
          include: {
            pekerjaan: {
              include: {
                project: true,
              },
            },
          },
        },
      },
    });
  }

  async update(id: number, dto: UpdateMaterialUsageDto) {
    return this.prisma.materialUsage.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    return this.prisma.materialUsage.delete({
      where: { id },
    });
  }
}