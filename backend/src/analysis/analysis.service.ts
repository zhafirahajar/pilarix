import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAnalysisDto } from './dto/create-analysis.dto';
import { UpdateAnalysisDto } from './dto/update-analysis.dto';
import { CreateAnalysisItemDto } from './dto/create-analysis-item.dto';

@Injectable()
export class AnalysisService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAnalysisDto) {
    return this.prisma.analysis.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.analysis.findMany({
      include: {
        items: {
          include: {
            material: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const analysis = await this.prisma.analysis.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            material: true,
          },
        },
      },
    });

    if (!analysis) {
      throw new NotFoundException('Analysis not found');
    }

    return analysis;
  }

  async update(id: number, dto: UpdateAnalysisDto) {
    await this.findOne(id);

    return this.prisma.analysis.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.analysis.delete({
      where: { id },
    });
  }

  // =========================================
  // 🔥 ANALYSIS ITEMS
  // =========================================

  async addItem(analysisId: number, dto: CreateAnalysisItemDto) {
    const analysisInstance = await this.findOne(analysisId);

    if (!analysisInstance) {
      throw new NotFoundException('Analysis not found');
    }
    
    await this.prisma.analysisItem.create({
      data: {
        analysisId,
        ...dto,
      },
    });
    
    const totalPrice = await this.calculateUnitPrice(analysisInstance.id);

    const newAnalysis = await this.prisma.analysis.update({
      where: { id: analysisInstance.id },
      data: { totalPrice: totalPrice.totalPrice },
    });

    return {newAnalysis, calculation: totalPrice}; ;
  }

  async removeItem(itemId: number) {
    return this.prisma.analysisItem.delete({
      where: { id: itemId },
    });
  }

  async calculateUnitPrice(analysisId: number) {
    const analysis = await this.findOne(analysisId);

    let total = 0;

    for (const item of analysis.items) {
      total += item.price * item.coefficient;
    }

    return {
      analysisId,
      unit: analysis.unit,
      totalPrice: total,
      breakdown: analysis.items.map((item) => ({
        material: item.material.name,
        price: item.price,
        coefficient: item.coefficient,
        subtotal: item.price * item.coefficient,
      })),
    };
  }
}