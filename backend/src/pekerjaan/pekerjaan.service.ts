import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePekerjaanDto } from './dto/create-pekerjaan.dto';

@Injectable()
export class PekerjaanService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePekerjaanDto) {
    return this.prisma.pekerjaan.create({
      data: {
        name: dto.name,
        projectId: dto.projectId,
      },
    });
  }

  async findAll() {
    return this.prisma.pekerjaan.findMany({
      orderBy: { id: 'desc' },
    });
  }

  async findByProject(projectId: number) {
    return this.prisma.pekerjaan.findMany({
      where: { projectId },
      include: {
        rabItems: true,
        transactions: true,
      },
    });
  }
}