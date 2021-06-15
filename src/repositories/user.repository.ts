import { NewUser } from './type'
import { User } from '@/entities'
import { EntityRepository, Repository } from 'typeorm'

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async getUsers(): Promise<User[]> {
    return this.find({
      order: {
        name: 'ASC',
        lastname: 'ASC',
      },
    })
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.findOne(id)
  }

  async createUser(newUser: NewUser): Promise<User> {
    return this.save(this.create(newUser))
  }

  async getUserWithReports(id: string): Promise<User | undefined> {
    return this.createQueryBuilder('user')
      .leftJoinAndSelect('user.reports', 'reports')
      .where('user.id = :id', { id })
      .getOne()
  }
}
