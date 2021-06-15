import { User } from '@/entities'
import { UserRepository } from '@/repositories'
import { Injectable } from '@nestjs/common'
import { CreateUserDto } from '../dtos'

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getUsers(): Promise<User[]> {
    return this.userRepository.getUsers()
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.userRepository.getUser(id)
  }

  async getUserWithReports(id: string): Promise<User | undefined> {
    return this.userRepository.getUserWithReports(id)
  }

  async createUser(dto: CreateUserDto): Promise<User> {
    return this.userRepository.createUser(dto)
  }
}
