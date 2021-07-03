import { User, Report } from '@/entities'
import { UserRepository } from '@/repositories'
import { Test, TestingModule } from '@nestjs/testing'
import { UserService } from './user.service'
import { v4 } from 'uuid'

describe('UserService', () => {
  let service: UserService
  let spyUserRepository: UserRepository
  let now: Date
  let user: User
  let id: string

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useFactory: () => ({
            getUser: jest.fn(() => Promise.resolve(undefined)),
            getUserWithReports: jest.fn(() => Promise.resolve(undefined)),
          }),
        },
      ],
    }).compile()

    service = module.get<UserService>(UserService)
    spyUserRepository = module.get<UserRepository>(UserRepository)
    now = new Date(Date.now())

    id = v4()
    user = {
      id,
      name: 'John',
      lastname: 'Doe',
      age: 10,
      createdAt: now,
      updatedAt: now,
      version: 1,
      reports: [],
    }
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('getUsers', () => {
    it('should return all users', async () => {
      const users: User[] = [
        { id: v4(), name: 'John', lastname: 'Doe', age: 10, createdAt: now, updatedAt: now, version: 1, reports: [] },
        { id: v4(), name: 'Jane', lastname: 'Doe', age: 22, createdAt: now, updatedAt: now, version: 1, reports: [] },
      ]
      spyUserRepository.getUsers = jest.fn(() => Promise.resolve(users))
      const result = await service.getUsers()
      expect(result).toEqual(users)
    })
  })

  describe('getUser', () => {
    it('should return a user', async () => {
      spyUserRepository.getUser = jest.fn(() => Promise.resolve(user))
      const result = await service.getUser(id)
      expect(result).toEqual(user)
    })

    it('should return undefined', async () => {
      const id = v4()
      const result = await service.getUser(id)
      expect(result).toBeUndefined()
    })
  })

  describe('getUserWithReports', () => {
    it('should return a user with reports', async () => {
      const userWithReports: User = {
        ...user,
        reports: [
          <Report>{
            id: v4(),
            name: 'report 1',
            createdAt: now,
            updatedAt: now,
          },
        ],
      }
      spyUserRepository.getUserWithReports = jest.fn(() => Promise.resolve(userWithReports))
      const result = await service.getUserWithReports(id)
      expect(result).toEqual(userWithReports)
    })

    it('should return undefined', async () => {
      const id = v4()
      const result = await service.getUserWithReports(id)
      expect(result).toBeUndefined()
    })
  })

  describe('createUser', () => {
    it('should return a new user', async () => {
      const id = v4()
      const newUserDto = {
        name: 'hello',
        lastname: 'world',
        age: 88,
      }

      const newUser: User = { ...newUserDto, id, createdAt: now, updatedAt: now, version: 1, reports: [] }

      spyUserRepository.createUser = jest.fn(() => Promise.resolve(newUser))
      const result = await service.createUser(newUserDto)
      expect(result).toEqual(newUser)
    })
  })
})
