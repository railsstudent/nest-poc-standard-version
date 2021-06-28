import { Report, User } from '@/entities'
import { Test, TestingModule } from '@nestjs/testing'
import { ReportService } from './report.service'
import { v4 } from 'uuid'
import { ReportRepository, UserRepository } from '@/repositories'

describe('ReportService', () => {
  let service: ReportService
  let spyReportRepository: ReportRepository
  let spyUserRepository: UserRepository
  let now: Date

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportService,
        { provide: ReportRepository, useValue: {} },
        { provide: UserRepository, useValue: {} },
      ],
    }).compile()

    service = module.get<ReportService>(ReportService)
    spyReportRepository = module.get<ReportRepository>(ReportRepository)
    spyUserRepository = module.get<UserRepository>(UserRepository)
    now = new Date(Date.now())
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('getReport', () => {
    it('should return a report by id', async () => {
      const id = v4()
      const report = <Report>{ id, name: 'Report A', createdAt: now, updatedAt: now, version: 1 }
      spyReportRepository.getReportById = jest.fn(() => Promise.resolve(report))
      const result = await service.getReport(id)
      expect(result).toEqual(report)
    })

    it('should return undefined', async () => {
      const id = v4()
      spyReportRepository.getReportById = jest.fn(() => Promise.resolve(undefined))
      const result = await service.getReport(id)
      expect(result).toBeUndefined()
    })
  })

  describe('getReportsByUserId', () => {
    it('should return a user', async () => {
      const id = v4()
      const reports = [<Report>{ id, name: 'Report A', createdAt: now, updatedAt: now, version: 1 }]

      spyReportRepository.getReportsByUserId = jest.fn(() => Promise.resolve(reports))
      const result = await service.getReportsByUserId(id)
      expect(result).toEqual(reports)
    })

    it('should return empty array', async () => {
      const id = v4()
      spyReportRepository.getReportsByUserId = jest.fn(() => Promise.resolve([]))
      const result = await service.getReportsByUserId(id)
      expect(result).toEqual([])
    })
  })

  describe('createReport', () => {
    it('should return a new report', async () => {
      const id = v4()
      const ownerId = v4()
      const newReportDto = {
        name: 'Report B',
        owner: ownerId,
      }

      const newReport = <Report>{
        name: newReportDto.name,
        owner: { id: newReportDto.owner },
        id,
        createdAt: now,
        updatedAt: now,
        version: 1,
      }

      spyReportRepository.createReport = jest.fn(() => Promise.resolve(newReport))
      spyUserRepository.findOne = jest.fn(() => Promise.resolve({ id: newReportDto.owner } as User))
      const result = await service.createReport(newReportDto)
      expect(result).toEqual(newReport)
    })

    it('should throw exception when owner is not found', async () => {
      const ownerId = v4()
      const newReportDto = {
        name: 'Report B',
        owner: ownerId,
      }

      spyUserRepository.findOne = jest.fn(() => Promise.resolve(undefined))

      try {
        await service.createReport(newReportDto)
      } catch (ex) {
        expect(ex.message).toEqual('Owner does not exist')
      }
    })
  })
})
