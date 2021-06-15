import { Report } from '@/entities'
import { ReportRepository } from '@/repositories'
import { Injectable } from '@nestjs/common'
import { CreateReportDto } from '../dtos'

@Injectable()
export class ReportService {
  constructor(private reportRepository: ReportRepository) {}

  async getReport(id: string): Promise<Report | undefined> {
    return this.reportRepository.getReportById(id)
  }

  async getReportsByUserId(userId: string): Promise<Report[]> {
    return this.reportRepository.getReportsByUserId(userId)
  }

  async createReport(dto: CreateReportDto): Promise<Report> {
    return this.reportRepository.createReport(dto)
  }
}
