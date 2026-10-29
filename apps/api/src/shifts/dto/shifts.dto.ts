import { IsNotEmpty, IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateShiftDto {
  @ApiProperty({ example: 'site-uuid-123' })
  @IsString()
  @IsNotEmpty()
  siteId!: string;

  @ApiProperty({ example: 'employee-uuid-123' })
  @IsString()
  @IsNotEmpty()
  employeeId!: string;

  @ApiProperty({ example: '2026-06-01T06:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  startTime!: string;

  @ApiProperty({ example: '2026-06-01T18:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  endTime!: string;

  @ApiPropertyOptional({ example: 'Main entrance guard desk' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CheckInDto {
  @ApiProperty({ example: 'shift-uuid-123' })
  @IsString()
  @IsNotEmpty()
  shiftId!: string;

  @ApiPropertyOptional({ example: 8.9806 })
  @IsOptional()
  checkInLat?: number;

  @ApiPropertyOptional({ example: 38.7578 })
  @IsOptional()
  checkInLng?: number;

  @ApiPropertyOptional({ example: 15.0 })
  @IsOptional()
  checkInAccuracy?: number;

  @ApiPropertyOptional({ example: 'qr-secret-string' })
  @IsOptional()
  @IsString()
  qrSecret?: string;
}

export class CheckOutDto {
  @ApiProperty({ example: 'attendance-record-uuid' })
  @IsString()
  @IsNotEmpty()
  attendanceRecordId!: string;

  @ApiPropertyOptional({ example: 8.9806 })
  @IsOptional()
  checkOutLat?: number;

  @ApiPropertyOptional({ example: 38.7578 })
  @IsOptional()
  checkOutLng?: number;
}
