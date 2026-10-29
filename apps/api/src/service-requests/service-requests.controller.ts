import { Controller, Post, Get, Body, Param, Patch, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ServiceRequestsService } from './service-requests.service';
import { CreateServiceRequestDto, UpdateServiceRequestStatusDto, TrackServiceRequestDto } from './dto/service-request.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role, RequestStatus } from '@prisma/client';

@ApiTags('Service Requests')
@Controller('service-requests')
export class ServiceRequestsController {
  constructor(private readonly serviceRequestsService: ServiceRequestsService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a new service request (Public or Client)' })
  async create(@Body() dto: CreateServiceRequestDto, @Request() req: any) {
    const userId = req?.user?.id;
    return this.serviceRequestsService.create(dto, userId);
  }

  @Post('track')
  @ApiOperation({ summary: 'Track a service request by reference and verification phone' })
  async track(@Body() dto: TrackServiceRequestDto) {
    return this.serviceRequestsService.track(dto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.OPERATIONS, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all service requests (Ops/Admin only)' })
  async findAll(@Query('status') status?: RequestStatus) {
    return this.serviceRequestsService.findAll(status);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.OPERATIONS, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get details of a service request' })
  async findOne(@Param('id') id: string) {
    return this.serviceRequestsService.findOne(id);
  }

  @Patch(':id/status')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.OPERATIONS, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update service request status' })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateServiceRequestStatusDto,
    @Request() req: any,
  ) {
    return this.serviceRequestsService.updateStatus(id, dto, req.user.id);
  }
}
