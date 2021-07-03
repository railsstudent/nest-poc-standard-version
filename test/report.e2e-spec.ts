import { Test, TestingModule } from '@nestjs/testing'
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common'
import * as request from 'supertest'
import { v4 } from 'uuid'
import { ReportController } from '../src/report/report.controller'
import { ReportService } from '../src/report/services/report.service'
import { expectedReport, expectedReports, newReportId, now, reportId, reportService, userId, owner } from './mock'

describe('ReportController (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ReportController],
      providers: [ReportService],
    })
      .overrideProvider(ReportService)
      .useValue(reportService)
      .compile()

    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(new ValidationPipe())
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('/report/:id (GET)', () => {
    it('should return a report', () => {
      return request(app.getHttpServer()).get(`/report/${reportId}`).expect(HttpStatus.OK).expect(expectedReport)
    })

    it('should return undefined', () => {
      const dummyId = v4()
      return request(app.getHttpServer()).get(`/report/${dummyId}`).expect(HttpStatus.OK).expect({})
    })
  })

  describe('/report/:userId/user (GET)', () => {
    it('should return user', () => {
      return request(app.getHttpServer()).get(`/report/${userId}/user`).expect(HttpStatus.OK).expect(expectedReports)
    })

    it('should return empty array', () => {
      const dummyId = v4()
      return request(app.getHttpServer()).get(`/report/${dummyId}/user`).expect(HttpStatus.OK).expect([])
    })
  })

  describe('/report (POST)', () => {
    it('should throw error when owner id is blank', () => {
      const dto = {
        name: 'Report A',
        owner: '',
      }
      return request(app.getHttpServer()).post('/report').send(dto).expect(HttpStatus.BAD_REQUEST)
    })

    it('should throw error when owner id is undefined', () => {
      const dto = {
        name: 'Report A',
      }
      return request(app.getHttpServer()).post('/report').send(dto).expect(HttpStatus.BAD_REQUEST)
    })

    it('should throw error when owner id is not uuid', () => {
      const dto = {
        name: 'Report A',
        owner: '1',
      }
      return request(app.getHttpServer()).post('/report').send(dto).expect(HttpStatus.BAD_REQUEST)
    })

    it('should throw error when report name is empty', () => {
      const dto = {
        name: '',
        owner: userId,
      }
      return request(app.getHttpServer()).post('/report').send(dto).expect(HttpStatus.BAD_REQUEST)
    })

    it('should throw error when report name is undefined', () => {
      const dto = {
        owner: userId,
      }
      return request(app.getHttpServer()).post('/report').send(dto).expect(HttpStatus.BAD_REQUEST)
    })

    it('should throw exception when owner does not exist', () => {
      const dto = {
        name: 'Report A',
        owner: v4(),
      }
      return request(app.getHttpServer()).post('/report').send(dto).expect(HttpStatus.BAD_REQUEST)
    })

    it('should create and return new report', () => {
      const dto = {
        name: 'Report A',
        owner: userId,
      }
      return request(app.getHttpServer())
        .post('/report')
        .send(dto)
        .expect(HttpStatus.CREATED)
        .expect({
          ...dto,
          id: newReportId,
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
          version: 1,
          owner: {
            ...owner,
            createdAt: now.toISOString(),
            updatedAt: now.toISOString(),
          },
        })
    })
  })
})
