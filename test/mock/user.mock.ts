import { CreateUserDto } from '@/user'
import { Report, User } from '@/entities'
import { newUserId, now, reportId, userId, userId2 } from './constant.mock'

export const allUsers: User[] = [
  {
    id: userId,
    name: 'John',
    lastname: 'Doe',
    age: 10,
    createdAt: now,
    updatedAt: now,
    version: 1,
    reports: [],
  },
  {
    id: userId2,
    name: 'Jane',
    lastname: 'Doe',
    age: 15,
    createdAt: now,
    updatedAt: now,
    version: 1,
    reports: [],
  },
]

export const expectedAllUsers = [
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

export const expectedUser = {
  id: userId,
  name: 'John',
  lastname: 'Doe',
  age: 10,
  createdAt: now.toISOString(),
  updatedAt: now.toISOString(),
  version: 1,
  reports: [],
}

const report: Report = {
  id: reportId,
  name: 'Report 1',
  createdAt: now,
  updatedAt: now,
  version: 1,
  owner: allUsers[0],
}

export const expectedUserWithReport = {
  ...expectedUser,
  reports: [
    {
      ...report,
      owner: {
        ...allUsers[0],
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
  ],
}

export const userService = {
  getUsers: () => allUsers,
  getUser: (id: string) => allUsers.find((user) => user.id === id),
  createUser: (dto: CreateUserDto) => {
    const newUser = {
      ...dto,
      id: newUserId,
      createdAt: now,
      updatedAt: now,
      version: 1,
      reports: [],
    }
    return newUser
  },
  getUserWithReports: (id: string) => {
    const user = allUsers.find((user) => user.id === id)
    if (user) {
      return {
        ...user,
        reports: [report],
      }
    }
    return undefined
  },
}
