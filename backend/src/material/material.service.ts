import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { QueryMaterialDto } from './dto/query-material.dto';

@Injectable()
export class MaterialService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMaterialDto) {
    return this.prisma.material.create({
      data: dto,
    });
  }

  async findAll(query: QueryMaterialDto) {
    return this.prisma.material.findMany({
      where: {
        name: query.search
          ? {
              contains: query.search,
              mode: 'insensitive',
            }
          : undefined,
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    const material = await this.prisma.material.findUnique({
      where: { id },
      include: {
        materialStocks: {
          include: {
            project: true,
          },
        },
      },
    });

    if (!material) {
      throw new NotFoundException('Material not found');
    }

    return material;
  }

  async update(id: number, dto: UpdateMaterialDto) {
    await this.findOne(id);

    return this.prisma.material.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.material.delete({
      where: { id },
    });
  }

 async getStockByProject(materialId: number, projectId: number) {
  const material = await this.prisma.material.findUnique({
    where: { id: materialId },
  });

  if (!material) {
    throw new NotFoundException('Material not found');
  }

  const project = await this.prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new NotFoundException('Project not found');
  }

  const stock = await this.prisma.projectMaterialStock.findUnique({
    where: {
      projectId_materialId: {
        projectId,
        materialId,
      },
    },
  });

  return {
    materialId,
    materialName: material.name,
    projectId,
    projectName: project.name,
    stock: stock?.stock ?? 0,
  };
}

  async getStockSummary(materialId: number) {
    const stocks = await this.prisma.projectMaterialStock.findMany({
      where: { materialId },
      include: {
        project: true,
      },
    });

    return stocks.map((s) => ({
      projectId: s.projectId,
      projectName: s.project.name,
      stock: s.stock,
    }));
  }
}