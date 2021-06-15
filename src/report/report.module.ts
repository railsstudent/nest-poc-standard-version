import { RepositoryModule } from '@/repositories'
import { Module } from '@nestjs/common'
import { ReportController } from './report.controller'
import { ReportService } from './services'

@Module({
  imports: [RepositoryModule],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
