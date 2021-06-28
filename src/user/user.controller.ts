import { UserService } from './services'
import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common'
import { User } from '@/entities'
import { CreateUserDto } from './dtos'

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getUsers(): Promise<User[]> {
    return this.userService.getUsers()
  }

  @Get(':id/report')
  async getUserWithReports(@Param('id', ParseUUIDPipe) id: string): Promise<User | undefined> {
    return this.userService.getUserWithReports(id)
  }

  @Get(':id')
  async getUser(@Param('id', ParseUUIDPipe) id: string): Promise<User | undefined> {
    return this.userService.getUser(id)
  }

  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<User> {
    return this.userService.createUser(dto)
  }
}
