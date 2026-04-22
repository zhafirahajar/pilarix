// material-transaction.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMaterialTransactionDto } from './dto/create-material-transaction.dto';
import { QueryMaterialTransactionDto } from './dto/query-material-transaction.dto';
import { TransactionType } from '@prisma/client';

@Injectable()
export class MaterialTransactionService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMaterialTransactionDto) {
    const { materialId, projectId, quantity, type } = dto;

    const isUsedInRAB = await this.prisma.materialUsage.findFirst({
    where: {
      materialId,
      rabItem: {
        pekerjaan: {
          projectId,
        },
      },
    },
  });

  if (!isUsedInRAB) {
    throw new BadRequestException(
      'Material is not planned in this project (not in RAB)',
    );
  }

    // 1. Ambil stock sekarang
    const stockRecord = await this.prisma.projectMaterialStock.findUnique({
      where: {
        projectId_materialId: {
          projectId,
          materialId,
        },
      },
    });

    const currentStock = stockRecord?.stock ?? 0;

    // 2. Hitung perubahan stock
    let newStock = currentStock;

    if (type === TransactionType.PURCHASE) {
      newStock += quantity;
    } else if (type === TransactionType.USAGE) {
      newStock -= quantity;

      if (newStock < 0) {
        throw new BadRequestException('Stock not enough');
      }
    } else if (type === TransactionType.ADJUSTMENT) {
      newStock = quantity; // overwrite
    }

    // 3. Simpan transaction + update stock (atomic)
    return this.prisma.$transaction(async (tx) => {
      // create transaction
      const transaction = await tx.materialTransaction.create({
        data: dto,
      });

      // upsert stock
      await tx.projectMaterialStock.upsert({
        where: {
          projectId_materialId: {
            projectId,
            materialId,
          },
        },
        update: {
          stock: newStock,
        },
        create: {
          projectId,
          materialId,
          stock: newStock,
        },
      });

      return transaction;
    });
  }

  async findAll(query: QueryMaterialTransactionDto) {
    return this.prisma.materialTransaction.findMany({
      where: {
        projectId: Number(query.projectId),
        materialId: Number(query.materialId),
      },
      include: {
        material: true,
        project: true,
        pekerjaan: true,
        rabItem: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getByProject(projectId: number) {
    return this.prisma.materialTransaction.findMany({
      where: { projectId },
      include: {
        material: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}