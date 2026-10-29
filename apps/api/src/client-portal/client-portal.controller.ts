import { Controller, Get, Post, Body, Param, UseGuards, Request, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role, CaseStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('Client Portal')
@Controller('client-portal')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.CLIENT)
@ApiBearerAuth()
export class ClientPortalController {
  constructor(private prisma: PrismaService) {}

  private async getAuthorizedClient(userId: string) {
    const client = await this.prisma.client.findUnique({
      where: { userId },
      include: { user: { select: { fullName: true, email: true, phone: true } } },
    });
    if (!client) {
      throw new ForbiddenException('Client profile not associated with this account');
    }
    return client;
  }

  @Get('overview')
  @ApiOperation({ summary: 'Client portal overview summary' })
  async getOverview(@Request() req: any) {
    const client = await this.getAuthorizedClient(req.user.id);

    const [requestsCount, openCasesCount, sitesCount] = await Promise.all([
      this.prisma.serviceRequest.count({ where: { clientId: client.id } }),
      this.prisma.case.count({ where: { clientId: client.id, status: { not: CaseStatus.CLOSED } } }),
      this.prisma.site.count({ where: { clientId: client.id } }),
    ]);

    return {
      client,
      stats: {
        totalRequests: requestsCount,
        openCases: openCasesCount,
        authorizedSites: sitesCount,
      },
    };
  }

  @Get('requests')
  @ApiOperation({ summary: 'List client service requests' })
  async getRequests(@Request() req: any) {
    const client = await this.getAuthorizedClient(req.user.id);
    return this.prisma.serviceRequest.findMany({
      where: { clientId: client.id },
      orderBy: { createdAt: 'desc' },
      include: { history: { orderBy: { createdAt: 'desc' } } },
    });
  }

  @Get('cases')
  @ApiOperation({ summary: 'List client feedback and complaint cases' })
  async getCases(@Request() req: any) {
    const client = await this.getAuthorizedClient(req.user.id);
    return this.prisma.case.findMany({
      where: { clientId: client.id },
      orderBy: { createdAt: 'desc' },
      include: { site: true, messages: { where: { isInternal: false } } },
    });
  }

  @Post('cases/:id/reopen')
  @ApiOperation({ summary: 'Reopen a closed case within 7 days' })
  async reopenCase(@Param('id') id: string, @Body('reason') reason: string, @Request() req: any) {
    const client = await this.getAuthorizedClient(req.user.id);
    const existing = await this.prisma.case.findUnique({ where: { id } });

    if (!existing || existing.clientId !== client.id) {
      throw new NotFoundException('Case not found');
    }

    if (existing.status !== CaseStatus.CLOSED) {
      throw new BadRequestException('Only closed cases can be reopened');
    }

    const closedAt = existing.closedAt || existing.updatedAt;
    const diffDays = (new Date().getTime() - new Date(closedAt).getTime()) / (1000 * 3600 * 24);
    if (diffDays > 7) {
      throw new BadRequestException('Case cannot be reopened after 7 days from closure');
    }

    return this.prisma.case.update({
      where: { id },
      data: {
        status: CaseStatus.IN_PROGRESS,
        history: {
          create: {
            fromStatus: CaseStatus.CLOSED,
            toStatus: CaseStatus.IN_PROGRESS,
            changedById: req.user.id,
            notes: reason || 'Reopened by client',
          },
        },
      },
    });
  }

  @Get('sites')
  @ApiOperation({ summary: 'List authorized sites for client' })
  async getSites(@Request() req: any) {
    const client = await this.getAuthorizedClient(req.user.id);
    return this.prisma.site.findMany({
      where: { clientId: client.id },
      include: { shifts: { include: { employee: { select: { fullName: true } } } } },
    });
  }
}
