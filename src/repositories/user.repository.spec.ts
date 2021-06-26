import { SelectQueryBuilder } from 'typeorm'
import { UserRepository } from './user.repository'
import { Test, TestingModule } from '@nestjs/testing'
import { Report, User } from '@/entities'
import { v4 } from 'uuid'

describe('UserRepository', () => {
  let service: UserRepository
  let now: Date

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserRepository],
    }).compile()

    service = module.get<UserRepository>(UserRepository)
    now = new Date(Date.now())
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('getUsers', () => {
    it('should find and return all users', async () => {
      const users: User[] = [
        { id: v4(), name: 'John', lastname: 'Doe', age: 10, createdAt: now, updatedAt: now, version: 1, reports: [] },
        { id: v4(), name: 'Jane', lastname: 'Doe', age: 22, createdAt: now, updatedAt: now, version: 1, reports: [] },
      ]
      jest.spyOn(service, 'find').mockImplementation(() => Promise.resolve(users))

      const result = await service.getUsers()
      expect(service.find).toBeCalled()
      expect(service.find).toBeCalledWith({
        order: {
          name: 'ASC',
          lastname: 'ASC',
        },
      })
      expect(result).toEqual(users)
    })
  })

  describe('getUser', () => {
    it('should find and return user by id', async () => {
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
      jest.spyOn(service, 'findOne').mockImplementation(() => Promise.resolve(user))

      const result = await service.getUser(id)
      expect(service.findOne).toBeCalled()
      expect(service.findOne).toBeCalledWith(id)
      expect(result).toEqual(user)
    })
  })

  describe('createUser', () => {
    it('should create a new user', async () => {
      const id = v4()
      const newUser = {
        name: 'New',
        lastname: 'User',
        age: 21,
      }

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
      jest.spyOn(service, 'create').mockImplementation(() => user)
      jest.spyOn(service, 'save').mockImplementation(() => Promise.resolve(user))

      const result = await service.createUser(newUser)
      expect(service.create).toBeCalled()
      expect(service.save).toBeCalled()
      expect(service.create).toBeCalledWith(newUser)
      expect(service.save).toBeCalledWith(user)
      expect(result).toEqual(user)
    })
  })

  describe('getUserWithReports', () => {
    it('should return a user with reports', async () => {
      const id = v4()

      const partialUser = {
        id,
        name: 'John',
        lastname: 'Doe',
        age: 10,
        createdAt: now,
        updatedAt: now,
        version: 1,
      }

      const owner = {
        ...partialUser,
        reports: [],
      }
      const reportId = v4()
      const report: Report = {
        id: reportId,
        name: 'report 1',
        owner,
        createdAt: now,
        updatedAt: now,
        version: 1,
      }

      const user: User = {
        ...partialUser,
        reports: [report],
      }

      const getOne = jest.fn(() => user)
      const where = jest.fn(() => ({
        getOne,
      }))
      const leftJoinAndSelect = jest.fn(() => ({
        where,
      }))
      const createQueryBuilder = () =>
        ({
          leftJoinAndSelect,
        } as unknown as SelectQueryBuilder<User>)
      jest.spyOn(service, 'createQueryBuilder').mockImplementation(createQueryBuilder)

      const result = await service.getUserWithReports(id)
      expect(service.createQueryBuilder).toBeCalled()
      expect(service.createQueryBuilder).toBeCalledWith('user')
      expect(leftJoinAndSelect).toBeCalled()
      expect(leftJoinAndSelect).toBeCalledWith('user.reports', 'reports')
      expect(where).toBeCalled()
      expect(where).toBeCalledWith('user.id = :id', { id })
      expect(getOne).toBeCalled()
      expect(result).toEqual(user)
    })
  })
})
