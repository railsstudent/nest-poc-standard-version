import { UserController } from './../src/user/user.controller'
import { UserService } from './../src/user/services/user.service'
import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, Module } from '@nestjs/common'
import * as request from 'supertest'
import { expectedAllUsers, userService } from './user.mock'

// const now = new Date()
// const userId = v4()
// const newUserId = v4()
// const reportId = v4()

// const allUsers: User[] = [
//   {
//     id: userId,
//     name: 'John',
//     lastname: 'Doe',
//     age: 10,
//     createdAt: now,
//     updatedAt: now,
//     version: 1,
//     reports: [],
//   },
//   {
//     id: v4(),
//     name: 'Jane',
//     lastname: 'Doe',
//     age: 15,
//     createdAt: now,
//     updatedAt: now,
//     version: 1,
//     reports: [],
//   },
// ]

// const report: Report = {
//   id: reportId,
//   name: 'Report 1',
//   createdAt: now,
//   updatedAt: now,
//   version: 1,
//   owner: {
//     id: userId,
//   } as User,
// }

// const userService = {
//   getUsers: () => {
//     console.log('called')
//     return allUsers
//   },
//   getUser: (id: string) => allUsers.find((user) => user.id === id),
//   createUser: (dto: CreateUserDto) => {
//     const newUser = {
//       ...dto,
//       id: newUserId,
//       createdAt: now,
//       updatedAt: now,
//       version: 1,
//       reports: [],
//     }
//     return newUser
//   },
//   getUserWithReports: (id: string) => {
//     const user = allUsers.find((user) => user.id === id)
//     if (user) {
//       return {
//         ...user,
//         reports: [report],
//       }
//     }
//     return undefined
//   },
// }

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
})
