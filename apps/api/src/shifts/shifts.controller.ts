import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ShiftsService } from './shifts.service';
import { CreateShiftDto, CheckInDto, CheckOutDto } from './dto/shifts.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Shifts & Attendance')
@Controller()
export class ShiftsController {
  constructor(private readonly shiftsService: ShiftsService) {}

  @Post('shifts')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.OPERATIONS, Role.SUPER_ADMIN, Role.SUPERVISOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Schedule guard shift' })
  async createShift(@Body() dto: CreateShiftDto) {
    return this.shiftsService.createShift(dto);
  }

  @Get('guard/shifts')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get shift schedule for logged in guard' })
  async getGuardShifts(@Request() req: any) {
    return this.shiftsService.getGuardShifts(req.user);
  }

  @Post('attendance/check-in')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Guard check-in with GPS and server timestamp' })
  async checkIn(@Body() dto: CheckInDto, @Request() req: any) {
    return this.shiftsService.checkIn(dto, req.user);
  }

  @Post('attendance/check-out')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Guard check-out with GPS' })
  async checkOut(@Body() dto: CheckOutDto, @Request() req: any) {
    return this.shiftsService.checkOut(dto, req.user);
  }

  @Get('reports/attendance')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.OPERATIONS, Role.SUPER_ADMIN, Role.SUPERVISOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get operational attendance report' })
  async getAttendanceReports() {
    return this.shiftsService.getAttendanceReports();
  }
}
