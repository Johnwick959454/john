import { IsNotEmpty, IsString, IsOptional, IsEnum, IsInt, Min, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ServiceType, ShiftCoverage, RequestStatus } from '@prisma/client';

export class CreateServiceRequestDto {
  @ApiProperty({ example: 'Solomon Tesfaye' })
  @IsString()
  @IsNotEmpty()
  contactName!: string;

  @ApiPropertyOptional({ example: 'Grand Hotel' })
  @IsOptional()
  @IsString()
  organizationName?: string;

  @ApiProperty({ example: '+251911223344' })
  @IsString()
  @IsNotEmpty()
  phone!: string;

  @ApiPropertyOptional({ example: 'solomon@example.com' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ enum: ServiceType })
  @IsEnum(ServiceType)
  serviceType!: ServiceType;

  @ApiProperty({ example: 'Bole Road, Next to Sunshine Building' })
  @IsString()
  @IsNotEmpty()
  siteAddress!: string;

  @ApiProperty({ example: 'Addis Ababa' })
  @IsString()
  @IsNotEmpty()
  city!: string;

  @ApiProperty({ example: 4 })
  @IsInt()
  @Min(1)
  guardCount!: number;

  @ApiProperty({ enum: ShiftCoverage })
  @IsEnum(ShiftCoverage)
  shiftCoverage!: ShiftCoverage;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isArmed?: boolean;

  @ApiPropertyOptional({ example: '2026-06-01' })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({ example: '6 months' })
  @IsOptional()
  @IsString()
  duration?: string;

  @ApiPropertyOptional({ example: 'Requires perimeter patrol and night vision gear' })
  @IsOptional()
  @IsString()
  additionalDetails?: string;

  @ApiPropertyOptional({ example: 'Phone' })
  @IsOptional()
  @IsString()
  preferredContact?: string;
}

export class UpdateServiceRequestStatusDto {
  @ApiProperty({ enum: RequestStatus })
  @IsEnum(RequestStatus)
  status!: RequestStatus;

  @ApiPropertyOptional({ example: 'Site assessment completed successfully' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class TrackServiceRequestDto {
  @ApiProperty({ example: 'SR-2026-00001' })
  @IsString()
  @IsNotEmpty()
  referenceNumber!: string;

  @ApiProperty({ example: '+251911223344' })
  @IsString()
  @IsNotEmpty()
  phone!: string;
}
