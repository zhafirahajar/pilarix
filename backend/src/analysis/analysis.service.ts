import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MaterialPriceCalculatorService } from '../material-price/material-price-calculator.service';
import { CreateAnalysisDto } from './dto/create-analysis.dto';
import { UpdateAnalysisDto } from './dto/update-analysis.dto';
import { CreateAnalysisItemDto } from './dto/create-analysis-item.dto';

@Injectable()
export class AnalysisService {
  constructor(
    private prisma: PrismaService,
    private calculator: MaterialPriceCalculatorService,
  ) {}

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

    const newItem = await this.prisma.analysisItem.create({
      data: {
        analysisId,
        ...dto,
      },
      include: {
        material: true,
      },
    });

    // Note: totalPrice calculation happens at project level (RabItem)
    // when material prices are assigned, not at Analysis level

    return {
      message: 'Analysis item added successfully',
      item: newItem,
      note: 'Item prices will be calculated when assigned to RabItems with project material prices',
    };
  }

  async removeItem(itemId: number) {
    return this.prisma.analysisItem.delete({
      where: { id: itemId },
    });
  }

  /**
   * Calculate unit price for an analysis in a specific project context
   * Delegates to MaterialPriceCalculatorService to avoid duplication
   */
  async calculateUnitPrice(analysisId: number, projectId: number) {
    return this.calculator.calculateUnitPrice(analysisId, projectId);
  }
}