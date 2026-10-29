import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceRequestDto, UpdateServiceRequestStatusDto, TrackServiceRequestDto } from './dto/service-request.dto';
import { RequestStatus } from '@prisma/client';

@Injectable()
export class ServiceRequestsService {
  constructor(private prisma: PrismaService) {}

  private async generateReferenceNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.prisma.serviceRequest.count();
    const sequence = (count + 1).toString().padStart(5, '0');
    return `SR-${year}-${sequence}`;
  }

  async create(dto: CreateServiceRequestDto, userId?: string) {
    const ref = await this.generateReferenceNumber();

    let clientId: string | undefined;
    if (userId) {
      const client = await this.prisma.client.findUnique({ where: { userId } });
      if (client) {
        clientId = client.id;
      }
    }

    const request = await this.prisma.serviceRequest.create({
      data: {
        referenceNumber: ref,
        contactName: dto.contactName,
        organizationName: dto.organizationName,
        phone: dto.phone,
        email: dto.email,
        serviceType: dto.serviceType,
        siteAddress: dto.siteAddress,
        city: dto.city,
        guardCount: dto.guardCount,
        shiftCoverage: dto.shiftCoverage,
        isArmed: dto.isArmed ?? false,
        startDate: dto.startDate ? new Date(dto.startDate) : null,
        duration: dto.duration || '1 month',
        additionalDetails: dto.additionalDetails,
        preferredContact: dto.preferredContact,
        status: RequestStatus.NEW,
        clientId,
        history: {
          create: {
            toStatus: RequestStatus.NEW,
            notes: 'Service request submitted',
          },
        },
      },
      include: { history: true },
    });

    return request;
  }

  async track(dto: TrackServiceRequestDto) {
    const req = await this.prisma.serviceRequest.findUnique({
      where: { referenceNumber: dto.referenceNumber },
      include: {
        history: {
          select: { toStatus: true, notes: true, createdAt: true },
        },
      },
    });

    if (!req) {
      throw new NotFoundException('Service request not found or invalid reference');
    }

    // Verify phone suffix / exact match
    const cleanReqPhone = req.phone.replace(/\D/g, '');
    const cleanInputPhone = dto.phone.replace(/\D/g, '');

    if (!cleanReqPhone.endsWith(cleanInputPhone.slice(-6)) && !cleanInputPhone.endsWith(cleanReqPhone.slice(-6))) {
      throw new BadRequestException('Invalid reference number or verification phone');
    }

    return {
      referenceNumber: req.referenceNumber,
      status: req.status,
      contactName: req.contactName,
      serviceType: req.serviceType,
      siteAddress: req.siteAddress,
      city: req.city,
      guardCount: req.guardCount,
      createdAt: req.createdAt,
      history: req.history,
    };
  }

  async findAll(status?: RequestStatus) {
    return this.prisma.serviceRequest.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        client: true,
        history: {
          include: { changedBy: { select: { fullName: true, role: true } } },
        },
      },
    });
  }

  async findOne(id: string) {
    const req = await this.prisma.serviceRequest.findUnique({
      where: { id },
      include: {
        client: true,
        history: {
          include: { changedBy: { select: { fullName: true, role: true } } },
          orderBy: { createdAt: 'desc' },
        },
        quotations: true,
      },
    });
    if (!req) throw new NotFoundException('Service request not found');
    return req;
  }

  async updateStatus(id: string, dto: UpdateServiceRequestStatusDto, userId: string) {
    const existing = await this.findOne(id);

    const updated = await this.prisma.serviceRequest.update({
      where: { id },
      data: {
        status: dto.status,
        history: {
          create: {
            fromStatus: existing.status,
            toStatus: dto.status,
            changedById: userId,
            notes: dto.notes,
          },
        },
      },
      include: { history: true },
    });

    return updated;
  }
}
