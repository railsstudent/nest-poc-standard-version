import { Test, TestingModule } from '@nestjs/testing'
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common'
import * as request from 'supertest'
import { expectedAllUsers, expectedUser, expectedUserWithReport, newUserId, now, userId, userService } from './mock'
import { v4 } from 'uuid'
import { UserController } from '../src/user/user.controller'
import { UserService } from '../src/user/services/user.service'

describe('UserController (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    })
      .overrideProvider(UserService)
      .useValue(userService)
      .compile()

    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(new ValidationPipe())
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('/user (GET)', () => {
    it('should return all users', () => {
      return request(app.getHttpServer()).get('/user').expect(HttpStatus.OK).expect(expectedAllUsers)
    })
  })

  describe('/user/:id (GET)', () => {
    it('should return user', () => {
      return request(app.getHttpServer()).get(`/user/${userId}`).expect(HttpStatus.OK).expect(expectedUser)
    })

    it('should return undefined', () => {
      const id = v4()
      return request(app.getHttpServer()).get(`/user/${id}`).expect(HttpStatus.OK).expect({})
    })
  })

  describe('/user (POST)', () => {
    it('should create and return new user', () => {
      const dto = {
        name: 'John',
        lastname: 'Doe',
        age: 10,
      }
      return request(app.getHttpServer())
        .post('/user')
        .send(dto)
        .expect(HttpStatus.CREATED)
        .expect({
          ...dto,
          id: newUserId,
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
          version: 1,
          reports: [],
        })
    })

    it('should throw error when age is negative', () => {
      const dto = {
        name: 'John',
        lastname: 'Doe',
        age: -1,
      }
      return request(app.getHttpServer()).post('/user').send(dto).expect(HttpStatus.BAD_REQUEST)
    })

    it('should throw error when age is missing', () => {
      const dto = {
        name: 'John',
        lastname: 'Doe',
      }
      return request(app.getHttpServer()).post('/user').send(dto).expect(HttpStatus.BAD_REQUEST)
    })

    it('should throw error when name is blank', () => {
      const dto = {
        name: '',
        lastname: 'Doe',
        age: 62,
      }
      return request(app.getHttpServer()).post('/user').send(dto).expect(HttpStatus.BAD_REQUEST)
    })

    it('should throw error when name is undefined', () => {
      const dto = {
        lastname: 'Doe',
        age: 62,
      }
      return request(app.getHttpServer()).post('/user').send(dto).expect(HttpStatus.BAD_REQUEST)
    })

    it('should throw error when name is null', () => {
      const dto = {
        name: null,
        lastname: 'Doe',
        age: 62,
      }
      return request(app.getHttpServer()).post('/user').send(dto).expect(HttpStatus.BAD_REQUEST)
    })

    it('should throw error when lastname is blank', () => {
      const dto = {
        name: 'John',
        lastname: '',
        age: 62,
      }
      return request(app.getHttpServer()).post('/user').send(dto).expect(HttpStatus.BAD_REQUEST)
    })

    it('should throw error when lastname is undefined', () => {
      const dto = {
        name: 'John',
        age: 62,
      }
      return request(app.getHttpServer()).post('/user').send(dto).expect(HttpStatus.BAD_REQUEST)
    })

    it('should throw error when lastname is null', () => {
      const dto = {
        name: 'John',
        lastname: null,
        age: 62,
      }
      return request(app.getHttpServer()).post('/user').send(dto).expect(HttpStatus.BAD_REQUEST)
    })
  })

  describe('/user/:id/report (GET)', () => {
    it('should return user with report', () => {
      return request(app.getHttpServer())
        .get(`/user/${userId}/report`)
        .expect(HttpStatus.OK)
        .expect(expectedUserWithReport)
    })

    it('should return undefined', () => {
      const id = v4()
      return request(app.getHttpServer()).get(`/user/${id}/report`).expect(HttpStatus.OK).expect({})
    })

    it('should return error if id is not uuid', () => {
      const id = '1'
      return request(app.getHttpServer()).get(`/user/${id}/report`).expect(HttpStatus.BAD_REQUEST)
    })
  })
})
