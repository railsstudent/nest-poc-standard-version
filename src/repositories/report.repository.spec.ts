import { SelectQueryBuilder } from 'typeorm'
import { Test, TestingModule } from '@nestjs/testing'
import { Report, User } from '@/entities'
import { v4 } from 'uuid'
import { ReportRepository } from './report.repository'

describe('ReportRepository', () => {
  let service: ReportRepository
  let now: Date
  let owner: User

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportRepository],
    }).compile()

    service = module.get<ReportRepository>(ReportRepository)
    now = new Date(Date.now())

    const userId = v4()
    const partialUser = {
      id: userId,
      name: 'John',
      lastname: 'Doe',
      age: 10,
      createdAt: now,
      updatedAt: now,
      version: 1,
    }

    owner = {
      ...partialUser,
      reports: [],
    }
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('getReportById', () => {
    it('should find and return user by id', async () => {
      const id = v4()
      const report: Report = {
        id,
        name: 'report 1',
        createdAt: now,
        updatedAt: now,
        version: 1,
        owner,
      }
      jest.spyOn(service, 'findOne').mockImplementation(() => Promise.resolve(report))

      const result = await service.getReportById(id)
      expect(service.findOne).toBeCalled()
      expect(service.findOne).toBeCalledWith(id)
      expect(result).toEqual(report)
    })
  })

  describe('createReport', () => {
    it('should create a new report', async () => {
      const id = v4()
      const ownerId = v4()
      const newReport = {
        name: 'New Report',
        owner: ownerId,
      }

      const report: Report = {
        id,
        name: 'New Report',
        createdAt: now,
        updatedAt: now,
        version: 1,
        owner,
      }
      jest.spyOn(service, 'create').mockImplementation(() => report)
      jest.spyOn(service, 'save').mockImplementation(() => Promise.resolve(report))

      const result = await service.createReport(newReport)
      expect(service.create).toBeCalled()
      expect(service.save).toBeCalled()
      expect(service.create).toBeCalledWith({
        name: newReport.name,
        owner: {
          id: newReport.owner,
        },
      })
      expect(service.save).toBeCalledWith(report)
      expect(result).toEqual(report)
    })
  })

  describe('getReportsByUserId', () => {
    it('should return reports with same owner', async () => {
      const reportId = v4()
      const reportId2 = v4()

      const reports: Report[] = [
        {
          id: reportId,
          name: 'Report 1',
          createdAt: now,
          updatedAt: now,
          version: 1,
          owner,
        },
        {
          id: reportId2,
          name: 'Report 2',
          createdAt: now,
          updatedAt: now,
          version: 1,
          owner,
        },
      ]

      const getMany = jest.fn(() => reports)
      const where = jest.fn(() => ({
        getMany,
      }))
      const innerJoin = jest.fn(() => ({
        where,
      }))
      const createQueryBuilder = () =>
        ({
          innerJoin,
        } as unknown as SelectQueryBuilder<Report>)
      jest.spyOn(service, 'createQueryBuilder').mockImplementation(createQueryBuilder)

      const result = await service.getReportsByUserId(owner.id)
      expect(service.createQueryBuilder).toBeCalled()
      expect(service.createQueryBuilder).toBeCalledWith('report')
      expect(innerJoin).toBeCalled()
      expect(innerJoin).toBeCalledWith('report.owner', 'owner')
      expect(where).toBeCalled()
      expect(where).toBeCalledWith('owner.id = :userId', { userId: owner.id })
      expect(getMany).toBeCalled()
      expect(result).toEqual(reports)
    })
  })
})
