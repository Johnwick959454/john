import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SitesService } from './sites.service';
import { CreateSiteDto, CreateEmployeeDto } from './dto/sites.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Sites & Employees')
@Controller()
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  @Get('sites')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all physical security sites' })
  async getSites() {
    return this.sitesService.findAllSites();
  }

  @Post('sites')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.OPERATIONS, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new security site' })
  async createSite(@Body() dto: CreateSiteDto) {
    return this.sitesService.createSite(dto);
  }

  @Get('employees')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.OPERATIONS, Role.SUPER_ADMIN, Role.SUPERVISOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all employee records' })
  async getEmployees() {
    return this.sitesService.findAllEmployees();
  }

  @Post('employees')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.OPERATIONS, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create employee record' })
  async createEmployee(@Body() dto: CreateEmployeeDto) {
    return this.sitesService.createEmployee(dto);
  }
}
