import { BadRequestException } from '@nestjs/common'
import { Report } from '@/entities'
import { CreateReportDto } from '@/report'
import {
  newReportId,
  now,
  owner,
  owner2,
  ownerMap,
  reportId,
  reportId2,
  reportId3,
  userId,
  userId2,
} from './constant.mock'

export const allReports: Report[] = [
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
    owner: owner2,
  },
  {
    id: reportId3,
    name: 'Report 3',
    createdAt: now,
    updatedAt: now,
    version: 1,
    owner,
  },
]

export const expectedAllReports = [
  {
    id: userId,
    name: 'John',
    lastname: 'Doe',
    age: 10,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    version: 1,
    reports: [],
  },
  {
    id: userId2,
    name: 'Jane',
    lastname: 'Doe',
    age: 15,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    version: 1,
    reports: [],
  },
]

export const expectedReport = {
  id: reportId,
  name: 'Report 1',
  createdAt: now.toISOString(),
  updatedAt: now.toISOString(),
  version: 1,
  owner: {
    ...owner,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  },
}

export const expectedReports = [
  {
    id: reportId,
    name: 'Report 1',
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    version: 1,
    owner: {
      ...owner,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
  },
  {
    id: reportId3,
    name: 'Report 3',
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    version: 1,
    owner: {
      ...owner,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
  },
]

export const reportService = {
  getReport: (id: string) => allReports.find((report) => report.id === id),
  getReportsByUserId: (userId: string) => allReports.filter((report) => report.owner.id === userId),
  createReport: (dto: CreateReportDto) => {
    const reportOwner = ownerMap[dto.owner]
    if (!reportOwner) {
      throw new BadRequestException('Owner is not found')
    }
    const newReport: Report = {
      id: newReportId,
      name: dto.name,
      createdAt: now,
      updatedAt: now,
      version: 1,
      owner,
    }
    return newReport
  },
}
