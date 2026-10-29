import { IsNotEmpty, IsString, IsOptional, IsEnum, IsInt, Min, Max, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CaseType, CaseSeverity, CaseStatus } from '@prisma/client';

export class CreateCaseDto {
  @ApiProperty({ enum: CaseType })
  @IsEnum(CaseType)
  type!: CaseType;

  @ApiProperty({ example: 'Guard late arrival at entrance gate' })
  @IsString()
  @IsNotEmpty()
  subject!: string;

  @ApiProperty({ example: 'The morning shift guard arrived 35 minutes past scheduled start.' })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiPropertyOptional({ example: 4 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiPropertyOptional({ example: 'site-uuid-123' })
  @IsOptional()
  @IsString()
  siteId?: string;

  @ApiPropertyOptional({ example: '+251911223344' })
  @IsOptional()
  @IsString()
  contactPhone?: string;
}

export class AddCaseMessageDto {
  @ApiProperty({ example: 'We have assigned a replacement guard and issued a warning.' })
  @IsString()
  @IsNotEmpty()
  message!: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isInternal?: boolean;
}

export class UpdateCaseStatusDto {
  @ApiProperty({ enum: CaseStatus })
  @IsEnum(CaseStatus)
  status!: CaseStatus;

  @ApiPropertyOptional({ example: 'Investigation completed, action taken' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ enum: CaseSeverity })
  @IsOptional()
  @IsEnum(CaseSeverity)
  severity?: CaseSeverity;

  @ApiPropertyOptional({ example: 'user-uuid-123' })
  @IsOptional()
  @IsString()
  assignedToId?: string;
}

export class TrackCaseDto {
  @ApiProperty({ example: 'CS-2026-00001' })
  @IsString()
  @IsNotEmpty()
  referenceNumber!: string;

  @ApiProperty({ example: '+251911223344' })
  @IsString()
  @IsNotEmpty()
  phone!: string;
}
