import { ReportRepository } from '@/repositories'
import { Test, TestingModule } from '@nestjs/testing'
import { ReportController } from './report.controller'
import { ReportService } from './services'
import { v4 } from 'uuid'
import { Report } from '@/entities'

describe('ReportController', () => {
  let controller: ReportController
  let reportService: ReportService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportController],
      providers: [
        ReportService,
        {
          provide: ReportRepository,
          useValue: {},
        },
      ],
    }).compile()

    controller = module.get<ReportController>(ReportController)
    reportService = module.get<ReportService>(ReportService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('getReport', () => {
    let now: Date

    beforeEach(() => {
      now = new Date(Date.now())
    })

    it('should return report', async () => {
      const id = v4()
      const report = <Report>{ id, name: 'Report A', createdAt: now, updatedAt: now, version: 1 }

      jest.spyOn(reportService, 'getReport').mockImplementation(() => Promise.resolve(report))
      const result = await controller.getReport(id)
      expect(result).toEqual(report)
    })

    it('should return undefined', async () => {
      const id = v4()

      jest.spyOn(reportService, 'getReport').mockImplementation(() => Promise.resolve(undefined))
      const result = await controller.getReport(id)
      expect(result).toBeUndefined()
    })
  })

  describe('getReportsByUserId', () => {
    let now: Date

    beforeEach(() => {
      now = new Date(Date.now())
    })

    it('should return reports', async () => {
      const id = v4()
      const id2 = v4()
      const reports = [
        <Report>{
          id,
          name: 'Report A',
          createdAt: now,
          updatedAt: now,
          version: 1,
        },
        <Report>{
          id: id2,
          name: 'Report B',
          createdAt: now,
          updatedAt: now,
          version: 1,
        },
      ]

      jest.spyOn(reportService, 'getReportsByUserId').mockImplementation(() => Promise.resolve(reports))
      const result = await controller.getReportsByUserId(id)
      expect(result).toEqual(reports)
    })

    it('should return empty array', async () => {
      const id = v4()

      jest.spyOn(reportService, 'getReportsByUserId').mockImplementation(() => Promise.resolve([]))
      const result = await controller.getReportsByUserId(id)
      expect(result).toEqual([])
    })
  })

  describe('createReport', () => {
    let now: Date

    beforeEach(() => {
      now = new Date(Date.now())
    })

    it('should return a new report', async () => {
      const id = v4()
      const newReportDto = {
        name: 'New Report',
        owner: id,
      }

      const newReport = <Report>{
        name: newReportDto.name,
        owner: { id: newReportDto.owner },
        id,
        createdAt: now,
        updatedAt: now,
        version: 1,
      }

      jest.spyOn(reportService, 'createReport').mockImplementation(() => Promise.resolve(newReport))
      const result = await controller.createReport(newReportDto)
      expect(result).toEqual(newReport)
    })
  })
})
