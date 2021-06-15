import { Test, TestingModule } from '@nestjs/testing'
import { UserController } from './user.controller'
import { UserService } from './services'
import { v4 } from 'uuid'
import { Report, User } from '@/entities'
import { UserRepository } from '@/repositories'

describe('UserController', () => {
  let controller: UserController
  let userService: UserService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: {},
        },
      ],
    }).compile()

    controller = module.get<UserController>(UserController)
    userService = module.get<UserService>(UserService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('getUsers', () => {
    let now: Date

    beforeEach(() => {
      now = new Date(Date.now())
    })

    it('should return all users', async () => {
      const users: User[] = [
        { id: v4(), name: 'John', lastname: 'Doe', age: 10, createdAt: now, updatedAt: now, version: 1, reports: [] },
        { id: v4(), name: 'Jane', lastname: 'Doe', age: 22, createdAt: now, updatedAt: now, version: 1, reports: [] },
      ]

      jest.spyOn(userService, 'getUsers').mockImplementation(() => Promise.resolve(users))
      const result = await controller.getUsers()
      expect(result).toEqual(users)
    })
  })

  describe('getUser', () => {
    let now: Date

    beforeEach(() => {
      now = new Date(Date.now())
    })

    it('should return a user', async () => {
      const id = v4()
      const user: User = {
        id,
        name: 'John',
        lastname: 'Doe',
        age: 10,
        createdAt: now,
        updatedAt: now,
        version: 1,
        reports: [],
      }

      jest.spyOn(userService, 'getUser').mockImplementation(() => Promise.resolve(user))
      const result = await controller.getUser(id)
      expect(result).toEqual(user)
    })

    it('should return undefined', async () => {
      const id = v4()

      jest.spyOn(userService, 'getUser').mockImplementation(() => Promise.resolve(undefined))
      const result = await controller.getUser(id)
      expect(result).toBeUndefined()
    })
  })

  describe('getUserWithReports', () => {
    let now: Date

    beforeEach(() => {
      now = new Date(Date.now())
    })

    it('should return a user with reports', async () => {
      const id = v4()
      const user: User = {
        id,
        name: 'John',
        lastname: 'Doe',
        age: 10,
        createdAt: now,
        updatedAt: now,
        version: 1,
        reports: [
          <Report>{
            id: v4(),
            name: 'report 1',
            createdAt: now,
            updatedAt: now,
          },
        ],
      }

      jest.spyOn(userService, 'getUserWithReports').mockImplementation(() => Promise.resolve(user))
      const result = await controller.getUserWithReports(id)
      expect(result).toEqual(user)
    })

    it('should return undefined', async () => {
      const id = v4()
      jest.spyOn(userService, 'getUserWithReports').mockImplementation(() => Promise.resolve(undefined))
      const result = await controller.getUserWithReports(id)
      expect(result).toBeUndefined()
    })
  })

  describe('createUser', () => {
    let now: Date

    beforeEach(() => {
      now = new Date(Date.now())
    })

    it('should return a new user', async () => {
      const id = v4()
      const newUserDto = {
        name: 'hello',
        lastname: 'world',
        age: 88,
      }

      const newUser: User = { ...newUserDto, id, createdAt: now, updatedAt: now, version: 1, reports: [] }

      jest.spyOn(userService, 'createUser').mockImplementation(() => Promise.resolve(newUser))
      const result = await controller.createUser(newUserDto)
      expect(result).toEqual(newUser)
    })
  })
})
