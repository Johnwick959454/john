import { IsNotEmpty, IsString, IsOptional, IsNumber, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSiteDto {
  @ApiProperty({ example: 'client-uuid-123' })
  @IsString()
  @IsNotEmpty()
  clientId!: string;

  @ApiProperty({ example: 'Bole HQ Towers' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'Bole Road, Next to Sunshine Building' })
  @IsString()
  @IsNotEmpty()
  address!: string;

  @ApiProperty({ example: 'Addis Ababa' })
  @IsString()
  @IsNotEmpty()
  city!: string;

  @ApiPropertyOptional({ example: 8.9806 })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ example: 38.7578 })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiPropertyOptional({ example: 100.0 })
  @IsOptional()
  @IsNumber()
  @Min(10)
  geofenceRadius?: number;
}

export class CreateEmployeeDto {
  @ApiProperty({ example: 'EMP-001' })
  @IsString()
  @IsNotEmpty()
  employeeNumber!: string;

  @ApiProperty({ example: 'Tadesse Alemu' })
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @ApiProperty({ example: '+251922334455' })
  @IsString()
  @IsNotEmpty()
  phone!: string;

  @ApiPropertyOptional({ example: 'tadesse@covenantshield.com' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ example: 'ACTIVE' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ example: 'user-uuid-123' })
  @IsOptional()
  @IsString()
  userId?: string;
}
