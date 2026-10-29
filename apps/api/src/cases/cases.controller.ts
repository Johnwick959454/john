import { Controller, Post, Get, Body, Param, Patch, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CasesService } from './cases.service';
import { CreateCaseDto, AddCaseMessageDto, UpdateCaseStatusDto, TrackCaseDto } from './dto/case.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Cases & Feedback')
@Controller('cases')
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  @Post()
  @ApiOperation({ summary: 'Submit new complaint / feedback (Public or Authenticated)' })
  async create(@Body() dto: CreateCaseDto, @Request() req: any) {
    const userId = req?.user?.id;
    return this.casesService.create(dto, userId);
  }

  @Post('track')
  @ApiOperation({ summary: 'Track a case by reference number' })
  async track(@Body() dto: TrackCaseDto) {
    return this.casesService.track(dto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get cases accessible to current user' })
  async findAll(@Request() req: any) {
    return this.casesService.findAllForUser(req.user);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get case details' })
  async findOne(@Param('id') id: string, @Request() req: any) {
    return this.casesService.findOne(id, req.user);
  }

  @Post(':id/messages')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add message / reply to a case' })
  async addMessage(
    @Param('id') id: string,
    @Body() dto: AddCaseMessageDto,
    @Request() req: any,
  ) {
    return this.casesService.addMessage(id, dto, req.user);
  }

  @Patch(':id/status')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update case status or assign case' })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateCaseStatusDto,
    @Request() req: any,
  ) {
    return this.casesService.updateStatus(id, dto, req.user);
  }
}
