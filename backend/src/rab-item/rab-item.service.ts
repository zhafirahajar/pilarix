import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MaterialPriceCalculatorService } from '../material-price/material-price-calculator.service';
import { CreateRabItemDto } from './dto/create-rab-item.dto';

@Injectable()
export class RabItemService {
  constructor(
    private prisma: PrismaService,
    private calculator: MaterialPriceCalculatorService,
  ) {}

  async create(dto: CreateRabItemDto) {
    // Get pekerjaan to access projectId
    const pekerjaan = await this.prisma.pekerjaan.findUnique({
      where: { id: dto.pekerjaanId },
      include: { project: true },
    });

    if (!pekerjaan) {
      throw new BadRequestException('Invalid pekerjaanId');
    }

    let unitPrice: number | null = null;
    let totalPrice: number | null = null;
    let analysis: any = null;

    // If analysisId is provided, calculate unitPrice from material prices
    if (dto.analysisId) {
      analysis = await this.prisma.analysis.findUnique({
        where: { id: dto.analysisId },
      });

      if (!analysis) {
        throw new BadRequestException('Invalid analysisId');
      }

      // Calculate unitPrice based on project material prices
      unitPrice = await this.calculator.calculateUnitPrice(
        dto.analysisId,
        pekerjaan.projectId,
      );
    } else if (dto.unitPrice !== undefined) {
      // If no analysis, use provided unitPrice (rounded to 2 decimals)
      unitPrice = Math.round(dto.unitPrice * 100) / 100;
    }

    // Calculate totalPrice = unitPrice * volume
    if (unitPrice !== null && dto.volume !== undefined) {
      totalPrice = Math.round(unitPrice * dto.volume * 100) / 100;
    }

    return this.prisma.rabItem.create({
      data: {
        ...dto,
        ...(analysis && {
          name: dto.name || analysis.name,
          unit: dto.unit || analysis.unit,
        }),
        totalPrice,
        unitPrice,
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

  async update(id: number, dto: Partial<CreateRabItemDto>) {
    const rabItem = await this.prisma.rabItem.findUnique({
      where: { id },
      include: { pekerjaan: { include: { project: true } } },
    });

    if (!rabItem) {
      throw new BadRequestException('RabItem not found');
    }

    let unitPrice: number | null = rabItem.unitPrice;
    let totalPrice: number | null = rabItem.totalPrice;

    // If analysisId is provided or changed, recalculate unitPrice
    if (dto.analysisId !== undefined) {
      const analysis = await this.prisma.analysis.findUnique({
        where: { id: dto.analysisId },
      });

      if (!analysis) {
        throw new BadRequestException('Invalid analysisId');
      }

      // Recalculate unitPrice based on project material prices
      unitPrice = await this.calculator.calculateUnitPrice(
        dto.analysisId,
        rabItem.pekerjaan.projectId,
      );
    } else if (dto.unitPrice !== undefined) {
      unitPrice = Math.round(dto.unitPrice * 100) / 100;
    }

    // Recalculate totalPrice if volume or unitPrice changed
    const volume = dto.volume !== undefined ? dto.volume : rabItem.volume;
    if (unitPrice !== null && volume !== null) {
      totalPrice = Math.round(unitPrice * volume * 100) / 100;
    } else {
      totalPrice = null;
    }

    return this.prisma.rabItem.update({
      where: { id },
      data: {
        ...dto,
        totalPrice,
        unitPrice,
      },
    });
  }

}