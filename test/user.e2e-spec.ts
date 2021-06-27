import { UserController } from './../src/user/user.controller'
import { UserService } from './../src/user/services/user.service'
import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, Module } from '@nestjs/common'
import * as request from 'supertest'
import { expectedAllUsers, expectedUser, userId, userService } from './user.mock'

@Module({
  providers: [UserService],
  controllers: [UserController],
})
class TestModule {}

describe('UserController (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestModule],
    })
      .overrideProvider(UserService)
      .useValue(userService)
      .compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('/user (GET)', () => {
    it('should return all users', () => {
      return request(app.getHttpServer()).get('/user').expect(200).expect(expectedAllUsers)
    })
  })

  describe('/user (GET)', () => {
    it('should return user', () => {
      return request(app.getHttpServer()).get(`/user/${userId}`).expect(200).expect(expectedUser)
    })
  })
})
