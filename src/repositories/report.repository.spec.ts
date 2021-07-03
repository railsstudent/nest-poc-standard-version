import { SelectQueryBuilder } from 'typeorm'
import { Test, TestingModule } from '@nestjs/testing'
import { Report, User } from '@/entities'
import { v4 } from 'uuid'
import { ReportRepository } from './report.repository'

describe('ReportRepository', () => {
  let service: ReportRepository
  let now: Date
  let owner: User
  let report: Report
  let id: string

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

    id = v4()
    report = {
      id,
      name: 'New Report',
      createdAt: now,
      updatedAt: now,
      version: 1,
      owner,
    }
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('getReportById', () => {
    it('should find and return user by id', async () => {
      jest.spyOn(service, 'findOne').mockImplementation(() => Promise.resolve(report))

      const result = await service.getReportById(id)
      expect(service.findOne).toBeCalled()
      expect(service.findOne).toBeCalledWith(id)
      expect(result).toEqual(report)
    })
  })

  describe('createReport', () => {
    it('should create a new report', async () => {
      const dto = {
        name: report.name,
        owner: owner.id,
      }

      jest.spyOn(service, 'create').mockImplementation(() => report)
      jest.spyOn(service, 'save').mockImplementation(() => Promise.resolve(report))

      const createArg = {
        name: report.name,
        owner: {
          id: report.owner.id,
        },
      }
      const result = await service.createReport(dto)
      expect(service.create).toBeCalled()
      expect(service.save).toBeCalled()
      expect(service.create).toBeCalledWith(createArg)
      expect(service.save).toBeCalledWith(service.create(createArg))
      expect(result).toEqual(report)
    })
  })

  describe('getReportsByUserId', () => {
    let getMany: any
    let where: any
    let innerJoinAndSelect: any
    let createQueryBuilder: any

    beforeEach(() => {
      getMany = jest.fn(() => undefined)
      where = jest.fn(() => ({
        getMany,
      }))
      innerJoinAndSelect = jest.fn(() => ({
        where,
      }))
      createQueryBuilder = () =>
        ({
          innerJoinAndSelect,
        } as unknown as SelectQueryBuilder<Report>)
    })

    it('should return reports with same owner', async () => {
      const reports: Report[] = [
        {
          ...report,
          id: v4(),
          name: 'Report 1',
        },
        {
          ...report,
          id: v4(),
          name: 'Report 2',
        },
      ]

      getMany = jest.fn(() => reports)
      jest.spyOn(service, 'createQueryBuilder').mockImplementation(createQueryBuilder)

      const result = await service.getReportsByUserId(owner.id)
      expect(service.createQueryBuilder).toBeCalled()
      expect(service.createQueryBuilder).toBeCalledWith('report')
      expect(innerJoinAndSelect).toBeCalled()
      expect(innerJoinAndSelect).toBeCalledWith('report.owner', 'owner')
      expect(where).toBeCalled()
      expect(where).toBeCalledWith('owner.id = :userId', { userId: owner.id })
      expect(getMany).toBeCalled()
      expect(result).toEqual(reports)
    })

    it('should return undefined', async () => {
      jest.spyOn(service, 'createQueryBuilder').mockImplementation(createQueryBuilder)

      const result = await service.getReportsByUserId(owner.id)
      expect(service.createQueryBuilder).toBeCalled()
      expect(service.createQueryBuilder).toBeCalledWith('report')
      expect(innerJoinAndSelect).toBeCalled()
      expect(innerJoinAndSelect).toBeCalledWith('report.owner', 'owner')
      expect(where).toBeCalled()
      expect(where).toBeCalledWith('owner.id = :userId', { userId: owner.id })
      expect(getMany).toBeCalled()
      expect(result).toEqual(undefined)
    })
  })
})
