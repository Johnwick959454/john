import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateShiftDto, CheckInDto, CheckOutDto } from './dto/shifts.dto';
import { AttendanceStatus } from '@prisma/client';

@Injectable()
export class ShiftsService {
  constructor(private prisma: PrismaService) {}

  // Haversine distance in meters
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // metres
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  async createShift(dto: CreateShiftDto) {
    const start = new Date(dto.startTime);
    const end = new Date(dto.endTime);

    if (start >= end) {
      throw new BadRequestException('Shift end time must be after start time');
    }

    // Check overlap
    const existing = await this.prisma.shift.findFirst({
      where: {
        employeeId: dto.employeeId,
        OR: [
          { startTime: { lte: start }, endTime: { gte: start } },
          { startTime: { lte: end }, endTime: { gte: end } },
        ],
      },
    });

    if (existing) {
      throw new ConflictException('Employee has an overlapping shift assignment');
    }

    return this.prisma.shift.create({
      data: {
        siteId: dto.siteId,
        employeeId: dto.employeeId,
        startTime: start,
        endTime: end,
        notes: dto.notes,
      },
      include: { site: true, employee: true },
    });
  }

  async getGuardShifts(user: any) {
    const employee = await this.prisma.employee.findUnique({
      where: { userId: user.id },
    });

    if (!employee) return [];

    return this.prisma.shift.findMany({
      where: { employeeId: employee.id },
      include: { site: true, attendance: true },
      orderBy: { startTime: 'desc' },
    });
  }

  async checkIn(dto: CheckInDto, user: any) {
    const shift = await this.prisma.shift.findUnique({
      where: { id: dto.shiftId },
      include: { site: true, employee: true },
    });

    if (!shift) throw new NotFoundException('Shift assignment not found');

    // Duplicate check
    const existingAtt = await this.prisma.attendanceRecord.findFirst({
      where: { shiftId: shift.id },
    });

    if (existingAtt && existingAtt.checkInTime) {
      throw new BadRequestException('Check-in already recorded for this shift');
    }

    const now = new Date(); // Authoritative server timestamp
    let status: AttendanceStatus = AttendanceStatus.PRESENT;

    // Check late arrival (e.g. >15 mins)
    const lateThreshold = new Date(shift.startTime);
    lateThreshold.setMinutes(lateThreshold.getMinutes() + 15);
    if (now > lateThreshold) {
      status = AttendanceStatus.LATE;
    }

    // Validate QR if provided
    let qrVerified = false;
    if (dto.qrSecret && dto.qrSecret === shift.site.qrSecret) {
      qrVerified = true;
    }

    // Geofence check if site has coordinates
    if (dto.checkInLat && dto.checkInLng && shift.site.latitude && shift.site.longitude) {
      const distance = this.calculateDistance(
        dto.checkInLat,
        dto.checkInLng,
        shift.site.latitude,
        shift.site.longitude,
      );
      if (distance > shift.site.geofenceRadius) {
        status = AttendanceStatus.UNVERIFIED;
      }
    }

    return this.prisma.attendanceRecord.create({
      data: {
        shiftId: shift.id,
        employeeId: shift.employeeId,
        siteId: shift.siteId,
        checkInTime: now,
        status,
        checkInLat: dto.checkInLat,
        checkInLng: dto.checkInLng,
        checkInAccuracy: dto.checkInAccuracy,
        qrVerified,
      },
      include: { site: true, shift: true },
    });
  }

  async checkOut(dto: CheckOutDto, user: any) {
    const record = await this.prisma.attendanceRecord.findUnique({
      where: { id: dto.attendanceRecordId },
    });

    if (!record) throw new NotFoundException('Attendance record not found');
    if (record.checkOutTime) {
      throw new BadRequestException('Check-out already recorded for this shift');
    }

    const now = new Date();

    return this.prisma.attendanceRecord.update({
      where: { id: record.id },
      data: {
        checkOutTime: now,
        checkOutLat: dto.checkOutLat,
        checkOutLng: dto.checkOutLng,
      },
    });
  }

  async getAttendanceReports() {
    return this.prisma.attendanceRecord.findMany({
      include: {
        employee: true,
        site: true,
        shift: true,
        corrections: { include: { approvedBy: { select: { fullName: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
