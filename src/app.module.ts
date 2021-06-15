import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from '@/user'
import { ReportModule } from '@/report'

@Module({
  imports: [TypeOrmModule.forRoot(), UserModule, ReportModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
