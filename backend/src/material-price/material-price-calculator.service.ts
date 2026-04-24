import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MaterialPriceCalculatorService {
  constructor(private prisma: PrismaService) {}

  /**
   * After a material price is created/updated, recalculate unitPrice and totalPrice
   * for all RabItems that use analyses containing this material
   */
  async updateRabItemsForMaterial(
    materialId: number,
    projectId: number,
  ): Promise<void> {
    // Find all analyses that use this material
    const analysisItems = await this.prisma.analysisItem.findMany({
      where: { materialId },
      include: { analysis: true },
    });

    if (analysisItems.length === 0) return;

    const analysisIds = analysisItems.map(item => item.analysisId);

    // Find all RabItems using these analyses
    const rabItems = await this.prisma.rabItem.findMany({
      where: {
        analysisId: { in: analysisIds },
        pekerjaan: { projectId }, // Only update rabItems in the same project
      },
      include: {
        analysis: {
          include: { 
            items: { 
              include: { 
                material: true 
              } 
            } 
          },
        },
      },
    });

    // Update each RabItem's unitPrice and totalPrice
    for (const rabItem of rabItems) {
      if (!rabItem.analysis) continue;

      const unitPrice = await this.calculateUnitPrice(
        rabItem.analysis.id,
        projectId,
      );

      const totalPrice =
        unitPrice !== null && rabItem.volume !== null
          ? Math.round(unitPrice * rabItem.volume * 100) / 100
          : null;

      await this.prisma.rabItem.update({
        where: { id: rabItem.id },
        data: { unitPrice, totalPrice },
      });
    }
  }

  /**
   * Calculate unitPrice for an analysis based on material prices and coefficients
   */
  async calculateUnitPrice(
    analysisId: number,
    projectId: number,
  ): Promise<number | null> {
    const analysisItems = await this.prisma.analysisItem.findMany({
      where: { analysisId },
      include: { material: true },
    });

    if (analysisItems.length === 0) return null;

    let totalUnitPrice = 0;
    let hasAllPrices = true;

    for (const item of analysisItems) {
      const materialPrice = await this.prisma.projectMaterialPrice.findUnique({
        where: {
          projectId_materialId: {
            projectId,
            materialId: item.materialId,
          },
        },
      });

      if (!materialPrice) {
        hasAllPrices = false;
        continue; // Skip materials without prices
      }

      totalUnitPrice += materialPrice.price * item.coefficient;
    }

    // Return null if not all materials have prices (to allow partial pricing)
    // Round to 2 decimal places
    const rounded = hasAllPrices ? Math.round(totalUnitPrice * 100) / 100 : null;
    return rounded;
  }
}
