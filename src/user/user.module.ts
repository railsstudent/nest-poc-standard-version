import { RepositoryModule } from '@/repositories'
import { Module } from '@nestjs/common'
import { UserService } from './services'
import { UserController } from './user.controller'

@Module({
  imports: [RepositoryModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
