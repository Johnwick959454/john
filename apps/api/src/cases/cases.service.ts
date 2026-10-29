import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCaseDto, AddCaseMessageDto, UpdateCaseStatusDto, TrackCaseDto } from './dto/case.dto';
import { CaseStatus, Role } from '@prisma/client';

@Injectable()
export class CasesService {
  constructor(private prisma: PrismaService) {}

  private async generateReferenceNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.prisma.case.count();
    const sequence = (count + 1).toString().padStart(5, '0');
    return `CS-${year}-${sequence}`;
  }

  async create(dto: CreateCaseDto, userId?: string) {
    const ref = await this.generateReferenceNumber();

    let clientId: string | undefined;
    if (userId) {
      const client = await this.prisma.client.findUnique({ where: { userId } });
      if (client) {
        clientId = client.id;
      }
    }

    // Default deadline: 48 hours for resolution
    const deadline = new Date();
    deadline.setHours(deadline.getHours() + 48);

    const newCase = await this.prisma.case.create({
      data: {
        referenceNumber: ref,
        type: dto.type,
        subject: dto.subject,
        description: dto.description,
        rating: dto.rating,
        clientId,
        siteId: dto.siteId,
        responseDeadline: deadline,
        status: CaseStatus.SUBMITTED,
        history: {
          create: {
            toStatus: CaseStatus.SUBMITTED,
            notes: 'Feedback / Case submitted',
          },
        },
      },
      include: { history: true, site: true },
    });

    return newCase;
  }

  async track(dto: TrackCaseDto) {
    const c = await this.prisma.case.findUnique({
      where: { referenceNumber: dto.referenceNumber },
      include: {
        client: { select: { phone: true } },
        messages: {
          where: { isInternal: false },
          select: { message: true, createdAt: true, sender: { select: { fullName: true } } },
          orderBy: { createdAt: 'asc' },
        },
        history: { select: { toStatus: true, notes: true, createdAt: true } },
      },
    });

    if (!c) throw new NotFoundException('Case record not found');

    if (c.client?.phone) {
      const cleanCasePhone = c.client.phone.replace(/\D/g, '');
      const cleanInputPhone = dto.phone.replace(/\D/g, '');
      if (!cleanCasePhone.endsWith(cleanInputPhone.slice(-6)) && !cleanInputPhone.endsWith(cleanCasePhone.slice(-6))) {
        throw new BadRequestException('Invalid reference or verification phone');
      }
    }

    return {
      referenceNumber: c.referenceNumber,
      type: c.type,
      subject: c.subject,
      description: c.description,
      status: c.status,
      createdAt: c.createdAt,
      messages: c.messages,
      history: c.history,
    };
  }

  async findAllForUser(user: any) {
    if (user.role === Role.SUPER_ADMIN || user.role === Role.OPERATIONS) {
      return this.prisma.case.findMany({
        orderBy: { createdAt: 'desc' },
        include: { client: true, site: true, assignedTo: { select: { fullName: true } } },
      });
    }

    if (user.role === Role.CLIENT) {
      const client = await this.prisma.client.findUnique({ where: { userId: user.id } });
      if (!client) return [];
      return this.prisma.case.findMany({
        where: { clientId: client.id },
        orderBy: { createdAt: 'desc' },
        include: { site: true, assignedTo: { select: { fullName: true } } },
      });
    }

    if (user.role === Role.SUPERVISOR) {
      const employee = await this.prisma.employee.findUnique({ where: { userId: user.id } });
      if (!employee) return [];
      const assignments = await this.prisma.siteSupervisorAssignment.findMany({
        where: { supervisorId: employee.id },
      });
      const siteIds = assignments.map((a) => a.siteId);
      return this.prisma.case.findMany({
        where: { siteId: { in: siteIds } },
        orderBy: { createdAt: 'desc' },
        include: { client: true, site: true },
      });
    }

    return [];
  }

  async findOne(id: string, user: any) {
    const c = await this.prisma.case.findUnique({
      where: { id },
      include: {
        client: true,
        site: true,
        assignedTo: { select: { id: true, fullName: true, email: true } },
        messages: {
          where: user.role === Role.CLIENT ? { isInternal: false } : undefined,
          include: { sender: { select: { id: true, fullName: true, role: true } } },
          orderBy: { createdAt: 'asc' },
        },
        attachments: true,
        history: {
          include: { changedBy: { select: { fullName: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!c) throw new NotFoundException('Case not found');

    // Ownership check
    if (user.role === Role.CLIENT) {
      const client = await this.prisma.client.findUnique({ where: { userId: user.id } });
      if (!client || c.clientId !== client.id) {
        throw new ForbiddenException('Access denied to this case');
      }
    }

    return c;
  }

  async addMessage(caseId: string, dto: AddCaseMessageDto, user: any) {
    await this.findOne(caseId, user); // checks authorization

    const isInternal = user.role === Role.CLIENT ? false : (dto.isInternal ?? false);

    return this.prisma.caseMessage.create({
      data: {
        caseId,
        senderId: user.id,
        message: dto.message,
        isInternal,
      },
      include: { sender: { select: { fullName: true, role: true } } },
    });
  }

  async updateStatus(caseId: string, dto: UpdateCaseStatusDto, user: any) {
    const c = await this.findOne(caseId, user);

    if (user.role === Role.CLIENT) {
      // Clients can only reopen closed cases within 7 days
      if (c.status === CaseStatus.CLOSED && dto.status === CaseStatus.IN_PROGRESS) {
        const closedAt = c.closedAt || c.updatedAt;
        const diffDays = (new Date().getTime() - new Date(closedAt).getTime()) / (1000 * 3600 * 24);
        if (diffDays > 7) {
          throw new BadRequestException('Cases can only be reopened within 7 days of closure');
        }
      } else {
        throw new ForbiddenException('Clients cannot arbitrarily change case status');
      }
    }

    const dataToUpdate: any = {
      status: dto.status,
      history: {
        create: {
          fromStatus: c.status,
          toStatus: dto.status,
          changedById: user.id,
          notes: dto.notes,
        },
      },
    };

    if (dto.severity) dataToUpdate.severity = dto.severity;
    if (dto.assignedToId) dataToUpdate.assignedToId = dto.assignedToId;

    if (dto.status === CaseStatus.RESOLUTION_PROPOSED) {
      dataToUpdate.resolvedAt = new Date();
    } else if (dto.status === CaseStatus.CLOSED) {
      dataToUpdate.closedAt = new Date();
    }

    return this.prisma.case.update({
      where: { id: caseId },
      data: dataToUpdate,
      include: { history: true },
    });
  }
}
