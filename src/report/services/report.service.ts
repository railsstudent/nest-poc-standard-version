import { Report } from '@/entities'
import { ReportRepository, UserRepository } from '@/repositories'
import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateReportDto } from '../dtos'

@Injectable()
export class ReportService {
  constructor(private reportRepository: ReportRepository, private userRepository: UserRepository) {}

  async getReport(id: string): Promise<Report | undefined> {
    return this.reportRepository.getReportById(id)
  }

  async getReportsByUserId(userId: string): Promise<Report[]> {
    return this.reportRepository.getReportsByUserId(userId)
  }

  async createReport(dto: CreateReportDto): Promise<Report> {
    const owner = await this.userRepository.findOne(dto.owner)
    if (!owner) {
      throw new BadRequestException('Owner does not exist')
    }
    return this.reportRepository.createReport(dto)
  }
}
