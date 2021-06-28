import { Report } from '@/entities'
import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common'
import { CreateReportDto } from './dtos'
import { ReportService } from './services'

@Controller('report')
export class ReportController {
  constructor(private reportService: ReportService) {}

  @Get(':id')
  async getReport(@Param('id', ParseUUIDPipe) id: string): Promise<Report | undefined> {
    return this.reportService.getReport(id)
  }

  @Get(':userId/user')
  async getReportsByUserId(@Param('userId', ParseUUIDPipe) userId: string): Promise<Report[] | undefined> {
    return this.reportService.getReportsByUserId(userId)
  }

  @Post()
  async createReport(@Body() dto: CreateReportDto): Promise<Report> {
    return this.reportService.createReport(dto)
  }
}
