import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMaterialPriceDto } from './dto/create-material-price.dto';
import { CreateBulkMaterialPriceDto } from './dto/create-bulk-material-price.dto';
import { UpdateMaterialPriceDto } from './dto/update-material-price.dto';
import { MaterialPriceCalculatorService } from './material-price-calculator.service';

@Injectable()
export class MaterialPriceService {
  constructor(
    private prisma: PrismaService,
    private calculator: MaterialPriceCalculatorService,
  ) {}

  async create(dto: CreateMaterialPriceDto, projectId: number) {
    const existing = await this.prisma.projectMaterialPrice.findUnique({
      where: {
        projectId_materialId: {
          projectId,
          materialId: dto.materialId,
        },
      },
    });

    if (existing) {
      throw new BadRequestException(
        'Material price for this project already exists',
      );
    }

    const created = await this.prisma.projectMaterialPrice.create({
      data: { ...dto, projectId },
    });

    // Update affected RabItems
    await this.calculator.updateRabItemsForMaterial(dto.materialId, projectId);

    return created;
  }

  async createBulk(dto: CreateBulkMaterialPriceDto, projectId: number) {
    // Check for duplicates in the input
    const materialIds = dto.items.map(item => item.materialId);
    if (new Set(materialIds).size !== materialIds.length) {
      throw new BadRequestException(
        'Duplicate materialIds in request',
      );
    }

    // Check for existing entries
    const existing = await this.prisma.projectMaterialPrice.findMany({
      where: {
        projectId,
        materialId: { in: materialIds },
      },
    });

    if (existing.length > 0) {
      throw new BadRequestException(
        `Material prices already exist for: ${existing.map(e => e.materialId).join(', ')}`,
      );
    }

    const created = await this.prisma.projectMaterialPrice.createMany({
      data: dto.items.map(item => ({
        ...item,
        projectId,
      })),
    });

    // Update affected RabItems for each material
    for (const materialId of materialIds) {
      await this.calculator.updateRabItemsForMaterial(materialId, projectId);
    }

    return created;
  }

  async findAll() {
    return this.prisma.projectMaterialPrice.findMany({
      include: {
        project: true,
        material: true,
      },
    });
  }

  async findByProject(projectId: number) {
    return this.prisma.projectMaterialPrice.findMany({
      where: { projectId },
      include: {
        material: true,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.projectMaterialPrice.findUnique({
      where: { id },
      include: {
        project: true,
        material: true,
      },
    });
  }

  async update(projectId: number, dto: UpdateMaterialPriceDto) {
    const existing = await this.prisma.projectMaterialPrice.findUnique({
      where: {
        projectId_materialId: {
          projectId,
          materialId: Number(dto.materialId),
        },
      },
    });

    if (!existing) {
      throw new BadRequestException('Material price not found');
    }

    const updated = await this.prisma.projectMaterialPrice.update({
      where: {
        projectId_materialId: {
          projectId,
          materialId: Number(dto.materialId),
        },
      },
      data: dto,
    });

    // Update affected RabItems
    await this.calculator.updateRabItemsForMaterial(
      existing.materialId,
      projectId,
    );

    return updated;
  }

  async remove(materialId: number, projectId: number) {
    return this.prisma.projectMaterialPrice.delete({
      where: {
        projectId_materialId: {
          projectId,
          materialId,
        },
      },
    });
  }
}