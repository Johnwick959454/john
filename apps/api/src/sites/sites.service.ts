import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSiteDto, CreateEmployeeDto } from './dto/sites.dto';

@Injectable()
export class SitesService {
  constructor(private prisma: PrismaService) {}

  async createSite(dto: CreateSiteDto) {
    return this.prisma.site.create({
      data: dto,
      include: { client: true },
    });
  }

  async findAllSites() {
    return this.prisma.site.findMany({
      include: { client: true, supervisors: { include: { supervisor: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createEmployee(dto: CreateEmployeeDto) {
    return this.prisma.employee.create({
      data: dto,
    });
  }

  async findAllEmployees() {
    return this.prisma.employee.findMany({
      include: { user: { select: { email: true, role: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
