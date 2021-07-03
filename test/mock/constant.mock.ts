import { User } from '@/entities'
import { v4 } from 'uuid'

export const now = new Date()
export const userId = v4()
export const userId2 = v4()
export const newReportId = v4()
export const reportId = v4()
export const reportId2 = v4()
export const reportId3 = v4()
export const newUserId = v4()

export const owner: User = {
  id: userId,
  name: 'John',
  lastname: 'Doe',
  age: 10,
  createdAt: now,
  updatedAt: now,
  version: 1,
  reports: [],
}

export const owner2: User = {
  id: userId2,
  name: 'Jane',
  lastname: 'Doe',
  age: 15,
  createdAt: now,
  updatedAt: now,
  version: 1,
  reports: [],
}

export const ownerMap = {
  [owner.id]: owner,
  [owner2.id]: owner2,
}
