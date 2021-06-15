import { ReportRepository } from './report.repository'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User, Report } from '@/entities'
import { UserRepository } from './user.repository'

@Module({
  imports: [TypeOrmModule.forFeature([User, Report, UserRepository, ReportRepository])],
  exports: [TypeOrmModule],
})
export class RepositoryModule {}
