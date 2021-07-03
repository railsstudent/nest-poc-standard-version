import { NewReport } from './type'
import { Report } from '@/entities'
import { EntityRepository, Repository } from 'typeorm'

@EntityRepository(Report)
export class ReportRepository extends Repository<Report> {
  async getReportById(id: string): Promise<Report | undefined> {
    return this.findOne(id)
  }

  async getReportsByUserId(userId: string): Promise<Report[]> {
    return this.createQueryBuilder('report')
      .innerJoinAndSelect('report.owner', 'owner')
      .where('owner.id = :userId', { userId })
      .getMany()
  }

  async createReport(newReport: NewReport): Promise<Report> {
    const { name, owner } = newReport
    return this.save(
      this.create({
        name,
        owner: {
          id: owner,
        },
      }),
    )
  }
}
